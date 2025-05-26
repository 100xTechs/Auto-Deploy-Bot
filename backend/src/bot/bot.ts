import { prisma } from "../utils/globle";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not set in environment variables.");
}


const bot = new TelegramBot(process.env.BOT_TOKEN!,
   { polling: true }
  );

// /start - Register user and provide command details
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id.toString();
  const from = msg.from;
  if (!from)
    return bot.sendMessage(parseInt(chatId), "❌ User info not found.");

  const telegramId = from.id.toString();
  const username = from.username || "";
  const fullName = [from.first_name, from.last_name].filter(Boolean).join(" ");

  try {
    const existingUser = await prisma.user.findUnique({
      where: { telegramId },
    });

    if (existingUser) {
      return bot.sendMessage(
        parseInt(chatId),
        `👋 Hello again, ${
          existingUser.fullName || existingUser.username || "User"
        }! You’re already registered.\n\nUse /help to see available commands.`
      );
    }

    await prisma.user.create({
      data: {
        telegramId,
        username,
        fullName,
        chatId,
      },
    });

    bot.sendMessage(
      parseInt(chatId),
      `✅ Successfully registered, ${
        fullName || username
      }!\n\nUse /help to see available commands.`
    );
  } catch (error) {
    console.error(error);
    bot.sendMessage(parseInt(chatId), "❌ Error occurred while registering.");
  }
});

// /help - List all commands
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;

  const helpMessage = `
🛠 Available Commands:
/start - Register yourself
/addproject <name> <repo> [branch] - Register a project
/projects - List all your projects
/detail - View your user information
/help - Show this help message
/delete - Delete account
/delete_project - Delete a project
  `;

  bot.sendMessage(chatId, helpMessage);
});

// /detail - View user info
bot.onText(/\/detail/, async (msg) => {
  const chatId = msg.chat.id.toString();
  const telegramId = msg.from?.id.toString() || "";

  try {
    const user = await prisma.user.findUnique({ where: { telegramId } });

    if (!user)
      return bot.sendMessage(
        parseInt(chatId),
        "❌ You are not registered. Use /start to register."
      );

    const info = `
👤 *Your Details*:
- Full Name: ${user.fullName || "-"}
- Username: @${user.username || "-"}
- Telegram ID: ${user.telegramId}
- Chat ID: ${user.chatId}
- Registered on: ${user.createdAt.toLocaleString()}
    `;

    bot.sendMessage(parseInt(chatId), info, { parse_mode: "Markdown" });
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "❌ Error occurred while fetching details.");
  }
});

// /delete-project
bot.onText(/\/delete_project/, async (msg) => {
  const chatId = msg.chat.id.toString();
  const telegramId = msg.from?.id.toString() || "";

  try {
    const user = await prisma.user.findUnique({
      where: { telegramId },
      include: { projects: true },
    });

    if (!user || user.projects.length === 0) {
      return bot.sendMessage(chatId, "📭 No projects found.");
    }

    const buttons = user.projects.map((p) => [
      {
        text: `🗑️ ${p.name}`,
        callback_data: `delete_project_${p.id}`,
      },
    ]);

    bot.sendMessage(chatId, "📋 Select a project to delete:", {
      reply_markup: {
        inline_keyboard: buttons,
      },
    });

    bot.on("callback_query", async (query) => {
      if (query.data?.startsWith("delete_project_")) {
        const projectId = query.data.split("_")[2];

        try {
          const project = await prisma.project.findUnique({
            where: { id: projectId },
          });

          if (!project) {
            return bot.sendMessage(chatId, "❌ Project not found.");
          }

          await prisma.project.delete({ where: { id: projectId } });

          bot.sendMessage(
            chatId,
            `🗑️ Project "${project.name}" has been deleted.`
          );
        } catch (error) {
          console.error(error);
          bot.sendMessage(
            chatId,
            "❌ Error occurred while deleting the project."
          );
        }
      }
    });
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "❌ Error occurred while fetching projects.");
  }
});

// /delete - Delete user with confirmation
bot.onText(/\/delete/, async (msg) => {
  const chatId = msg.chat.id.toString();
  const telegramId = msg.from?.id.toString() || "";

  try {
    const user = await prisma.user.findUnique({ where: { telegramId } });

    if (!user) {
      return bot.sendMessage(parseInt(chatId), "❌ You are not registered.");
    }

    bot.sendMessage(
      parseInt(chatId),
      "⚠️ Are you sure you want to delete your account? Reply with 'YES' to confirm."
    );

    bot.once("message", async (response) => {
      if (response.text?.toLowerCase() === "yes") {
        await prisma.user.delete({ where: { telegramId } });
        bot.sendMessage(parseInt(chatId), `🗑️ Your account has been deleted.`);
      } else {
        bot.sendMessage(parseInt(chatId), "❌ Account deletion canceled.");
      }
    });
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "❌ Error occurred while deleting your account.");
  }
});

// /addproject - Add project
bot.onText(/\/addproject (.+)/, async (msg, match) => {
  const chatId = msg.chat.id.toString();
  const telegramId = msg.from?.id.toString() || "";

  try {
    const user = await prisma.user.findUnique({ where: { telegramId } });
    if (!user)
      return bot.sendMessage(chatId, "❌ You must register first with /start.");

    const input = match?.[1]?.split(" ") || [];
    const [name, githubRepo, githubBranch = "main"] = input;

    if (!name || !githubRepo) {
      return bot.sendMessage(
        chatId,
        "⚠️ Usage: /addproject <project_name> <github_repo> [branch]\n\nExample:\n/addproject my-app user/repo main"
      );
    }

    const webhookSecret = crypto.randomUUID();

    const project = await prisma.project.create({
      data: {
        name,
        githubRepo,
        githubBranch,
        webhookSecret,
        userId: user.id,
      },
    });

    const webhookUrl = `https://api.autodeploybot.kishanvyas.tech/api/webhook/github/${project.id}`;

    const setupMsg = `
✅ *Project registered successfully!*

📦 Project Name: ${name}
🔗 GitHub Repo: ${githubRepo}
🌿 Branch: ${githubBranch}

🔐 Webhook Secret:
\`${webhookSecret}\`

🔗 Add this webhook to your GitHub repo:
\`${webhookUrl}\`

📩 Enable Events: push, pull_request, workflow_run
    `;

    bot.sendMessage(chatId, setupMsg, { parse_mode: "Markdown" });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Failed to register project.");
  }
});

// /projects - List projects with inline keyboard
bot.onText(/\/projects/, async (msg) => {
  const chatId = msg.chat.id.toString();
  const telegramId = msg.from?.id.toString() || "";

  try {
    const user = await prisma.user.findUnique({
      where: { telegramId },
      include: { projects: true },
    });

    if (!user || user.projects.length === 0) {
      return bot.sendMessage(chatId, "📭 No projects found.");
    }

    const buttons = user.projects.map((p) => [
      {
        text: `📁 ${p.name}`,
        callback_data: `project_${p.id}`,
      },
    ]);

    bot.sendMessage(chatId, "📋 Your Projects:", {
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "❌ Error occurred while fetching projects.");
  }
});

console.log("🤖 Telegram bot is running...");
