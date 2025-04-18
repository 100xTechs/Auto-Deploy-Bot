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

app.use(bodyParser.json());

function verifySignature(secret: string, payload: string, signature: string): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = "sha256=" + hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

app.post("/api/webhook/github/:projectId", async (req : any, res  :any) => {
  const projectId = req.params.projectId;
  const rawBody = JSON.stringify(req.body);
  const signature = req.headers["x-hub-signature-256"] as string;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { user: true },
    });

    if (!project || !project.webhookSecret) {
      return res.status(404).send("Project not found");
    }

    if (!verifySignature(project.webhookSecret, rawBody, signature)) {
      return res.status(401).send("Invalid signature");
    }

    const event = req.headers["x-github-event"] as string;
    const payload = req.body;

    // Log the webhook event
    await prisma.webhookEvent.create({
      data: {
        projectId: project.id,
        eventType: event,
        payload: rawBody,
      },
    });

    // Simulate deploy logic here (e.g., pull code, restart server, etc.)
    // In this placeholder, we'll just mark it successful
    await prisma.deployment.create({
      data: {
        projectId: project.id,
        status: "SUCCESS",
        commitHash: payload.after,
        userId: project.userId,
      },
    });

    // Notify user on Telegram
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
