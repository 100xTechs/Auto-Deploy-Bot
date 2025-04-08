import { prisma } from "../utils/globle";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();
const bot = new TelegramBot(process.env.BOT_TOKEN!, { polling: true });

// /start -> Register user
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
        }! You’re already registered.`
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
      `✅ Successfully registered, ${fullName || username}!`
    );
  } catch (error) {
    console.error(error);
    bot.sendMessage(parseInt(chatId), "❌ Error occurred while registering.");
  }
});

// /detail -> View user details
bot.onText(/\/detail/, async (msg) => {
  const chatId = msg.chat.id.toString();
  const telegramId = msg.from?.id.toString() || "";

  const user = await prisma.user.findUnique({ where: { telegramId } });

  if (!user) {
    return bot.sendMessage(
      parseInt(chatId),
      "❌ You are not registered. Use /start to register."
    );
  }

  const info = `
  👤 Your Details:
  - Full Name: ${user.fullName || "-"}
  - Username: @${user.username || "-"}
  - Telegram ID: ${user.telegramId}
  - Chat ID: ${user.chatId}
  - Registered on: ${user.createdAt.toLocaleString()}
    `;

  bot.sendMessage(parseInt(chatId), info);
});

// /delete -> Delete user
bot.onText(/\/delete/, async (msg) => {
  const chatId = msg.chat.id.toString();
  const telegramId = msg.from?.id.toString() || "";

  const user = await prisma.user.findUnique({ where: { telegramId } });

  if (!user) {
    return bot.sendMessage(parseInt(chatId), "❌ You are not registered.");
  }

  await prisma.user.delete({ where: { telegramId } });

  bot.sendMessage(parseInt(chatId), `🗑️ Your account has been deleted.`);
});

console.log("🤖 Bot is running...");
