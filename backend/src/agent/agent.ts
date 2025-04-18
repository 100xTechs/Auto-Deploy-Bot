// agent.ts
import express from "express";
import { prisma } from "../utils/globle";
import bodyParser from "body-parser";
import crypto from "crypto";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const bot = new TelegramBot(process.env.BOT_TOKEN!, { polling: false });

app.use(
  bodyParser.json({
    verify: (req: any, res, buf) => {
      // Store the raw body buffer for signature verification
      req.rawBody = buf;
    },
  })
);

function verifySignature(
  secret: string,
  payload: Buffer | undefined,
  signature: string | undefined
): boolean {
  // Add safety checks
  if (!payload) {
    console.error("Payload is undefined in verifySignature");
    return false;
  }
  
  if (!signature) {
    console.error("Signature is undefined in verifySignature");
    return false;
  }

  try {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = "sha256=" + hmac.update(payload).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch (error) {
    console.error("Error during signature verification:", error);
    return false;
  }
}

app.post("/api/webhook/github/:projectId", async (req: any, res: any) => {
  const projectId = req.params.projectId;
  const signature = req.headers["x-hub-signature-256"] as string;
  const event = req.headers["x-github-event"] as string;

  // Add debug logging
  console.log("Webhook received for project:", projectId);
  console.log("Event type:", event);
  console.log("Raw body exists:", !!req.rawBody);
  
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { user: true },
    });

    if (!project || !project.webhookSecret) {
      return res.status(404).send("Project not found");
    }

    // Check if rawBody exists
    if (!req.rawBody) {
      console.error("Raw body is undefined - cannot verify signature");
      return res.status(400).send("Missing raw body for signature verification");
    }

    if (!verifySignature(project.webhookSecret, req.rawBody, signature)) {
      return res.status(401).send("Invalid signature");
    }

    const payload = req.body;
    const rawBodyString = req.rawBody.toString();

    await prisma.webhookEvent.create({
      data: {
        projectId: project.id,
        eventType: event,
        payload: rawBodyString,
      },
    });

    // Handle the "ping" event (sent when webhook is first configured)
    if (event === "ping") {
      // Send connection confirmation message
      bot.sendMessage(
        parseInt(project.user.chatId),
        `✅ GitHub webhook successfully connected to *${project.name}*\n\n📦 Repo: \`${project.githubRepo}\`\n🔧 Webhook ID: \`${payload.hook.id}\``,
        { parse_mode: "Markdown" }
      );
      
      return res.status(200).send("Webhook connection successful");
    }

    // Handle regular deployment events (existing code)
    await prisma.deployment.create({
      data: {
        projectId: project.id,
        status: "SUCCESS",
        commitHash: payload.after,
        userId: project.userId,
      },
    });

    // Regular deployment notification
    bot.sendMessage(
      parseInt(project.user.chatId),
      `🚀 Deployment triggered for *${project.name}*\n\n📦 Repo: \`${project.githubRepo}\`\n🌿 Branch: \`${project.githubBranch}\`\n🔔 Event: \`${event}\``,
      { parse_mode: "Markdown" }
    );

    res.status(200).send("Webhook received and processed");
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(4000, () => {
  console.log("📡 Agent server listening on port 4000");
});
