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
  const event = req.headers["x-github-event"] as string;

  // Try both signature formats that GitHub might send
  const signature256 = req.headers["x-hub-signature-256"] as string;
  const signatureSha1 = req.headers["x-hub-signature"] as string;
  const signature = signature256 || signatureSha1;

  // Log all headers to see what's actually coming in from GitHub
  console.log("Webhook received for project:", projectId);
  console.log("Event type:", event);
  console.log("Raw body exists:", !!req.rawBody);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));

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
      return res
        .status(400)
        .send("Missing raw body for signature verification");
    }

    // Check if signature exists
    if (!signature) {
      console.error("No signature header found in request");
      console.error("Available headers:", Object.keys(req.headers).join(", "));
      return res.status(400).send("Missing signature header");
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
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Deploy", callback_data: "deploy" },
              { text: "Deny", callback_data: "deny" },
            ],
          ],
        },
      }
    );

    bot.on("callback_query", async (query) => {
      if (query.data?.startsWith("project_")) {
        const chatId = query.message?.chat.id.toString();
        const projectId = query.data?.split("_")[1];

        try {
          const project = await prisma.project.findUnique({
            where: { id: projectId },
          });

          if (!project) {
            return bot.sendMessage(chatId!, "❌ Project not found.");
          }

          const projectDetails = `
        📦 *Project Details*:
        - Name: ${project.name}
        - GitHub Repo: ${project.githubRepo}
        - Branch: ${project.githubBranch}
        - Webhook Secret: \`${project.webhookSecret}\`
    `;

          bot.sendMessage(chatId!, projectDetails, { parse_mode: "Markdown" });
        } catch (error) {
          console.error(error);
          bot.sendMessage(
            chatId!,
            "❌ Error occurred while fetching project details."
          );
        }
      }

      const userResponse = query.data; // "deploy" or "deny"
      const userId = query.from.id;
      const userName = query.from.username || query.from.first_name;

      // Log the user response in a comment
      console.log(`User ${userName} (${userId}) selected: ${userResponse}`);

      // Respond to the user action
      if (userResponse === "deploy") {
        bot.sendMessage(
          query.message?.chat.id!,
          "✅ Deployment approved and initiated."
        );
      } else if (userResponse === "deny") {
        bot.sendMessage(query.message?.chat.id!, "❌ Deployment denied.");
      }

      // Acknowledge the callback query
      bot.answerCallbackQuery(query.id);
    });

    res.status(200).send("Webhook received and processed");
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(4000, () => {
  console.log("📡 Agent server listening on port 4000");
});
