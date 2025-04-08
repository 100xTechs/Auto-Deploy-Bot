"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globle_1 = require("../utils/globle");
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bot = new node_telegram_bot_api_1.default(process.env.BOT_TOKEN, { polling: true });
// /start -> Register user
bot.onText(/\/start/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id.toString();
    const from = msg.from;
    if (!from)
        return bot.sendMessage(parseInt(chatId), "❌ User info not found.");
    const telegramId = from.id.toString();
    const username = from.username || "";
    const fullName = [from.first_name, from.last_name].filter(Boolean).join(" ");
    try {
        const existingUser = yield globle_1.prisma.user.findUnique({
            where: { telegramId },
        });
        if (existingUser) {
            return bot.sendMessage(parseInt(chatId), `👋 Hello again, ${existingUser.fullName || existingUser.username || "User"}! You’re already registered.`);
        }
        yield globle_1.prisma.user.create({
            data: {
                telegramId,
                username,
                fullName,
                chatId,
            },
        });
        bot.sendMessage(parseInt(chatId), `✅ Successfully registered, ${fullName || username}!`);
    }
    catch (error) {
        console.error(error);
        bot.sendMessage(parseInt(chatId), "❌ Error occurred while registering.");
    }
}));
// /detail -> View user details
bot.onText(/\/detail/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chatId = msg.chat.id.toString();
    const telegramId = ((_a = msg.from) === null || _a === void 0 ? void 0 : _a.id.toString()) || "";
    const user = yield globle_1.prisma.user.findUnique({ where: { telegramId } });
    if (!user) {
        return bot.sendMessage(parseInt(chatId), "❌ You are not registered. Use /start to register.");
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
}));
// /delete -> Delete user
bot.onText(/\/delete/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chatId = msg.chat.id.toString();
    const telegramId = ((_a = msg.from) === null || _a === void 0 ? void 0 : _a.id.toString()) || "";
    const user = yield globle_1.prisma.user.findUnique({ where: { telegramId } });
    if (!user) {
        return bot.sendMessage(parseInt(chatId), "❌ You are not registered.");
    }
    yield globle_1.prisma.user.delete({ where: { telegramId } });
    bot.sendMessage(parseInt(chatId), `🗑️ Your account has been deleted.`);
}));
console.log("🤖 Bot is running...");
