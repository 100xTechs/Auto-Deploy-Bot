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
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
const bot = new node_telegram_bot_api_1.default(process.env.BOT_TOKEN, { polling: true });
// /start - Register user and provide command details
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
            return bot.sendMessage(parseInt(chatId), `👋 Hello again, ${existingUser.fullName || existingUser.username || "User"}! You’re already registered.\n\nUse /help to see available commands.`);
        }
        yield globle_1.prisma.user.create({
            data: {
                telegramId,
                username,
                fullName,
                chatId,
            },
        });
        bot.sendMessage(parseInt(chatId), `✅ Successfully registered, ${fullName || username}!\n\nUse /help to see available commands.`);
    }
    catch (error) {
        console.error(error);
        bot.sendMessage(parseInt(chatId), "❌ Error occurred while registering.");
    }
}));
// /help - List all commands
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `
🛠 Available Commands:
/start - Register yourself
/detail - View your user information
/addproject <name> <repo> [branch] - Register a project
/projects - List all your projects
/help - Show this help message
  `;
    bot.sendMessage(chatId, helpMessage);
});
// /detail - View user info
bot.onText(/\/detail/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chatId = msg.chat.id.toString();
    const telegramId = ((_a = msg.from) === null || _a === void 0 ? void 0 : _a.id.toString()) || "";
    try {
        const user = yield globle_1.prisma.user.findUnique({ where: { telegramId } });
        if (!user)
            return bot.sendMessage(parseInt(chatId), "❌ You are not registered. Use /start to register.");
        const info = `
👤 *Your Details*:
- Full Name: ${user.fullName || "-"}
- Username: @${user.username || "-"}
- Telegram ID: ${user.telegramId}
- Chat ID: ${user.chatId}
- Registered on: ${user.createdAt.toLocaleString()}
    `;
        bot.sendMessage(parseInt(chatId), info, { parse_mode: "Markdown" });
    }
    catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "❌ Error occurred while fetching details.");
    }
}));
// /delete - Delete user with confirmation
bot.onText(/\/delete/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chatId = msg.chat.id.toString();
    const telegramId = ((_a = msg.from) === null || _a === void 0 ? void 0 : _a.id.toString()) || "";
    try {
        const user = yield globle_1.prisma.user.findUnique({ where: { telegramId } });
        if (!user) {
            return bot.sendMessage(parseInt(chatId), "❌ You are not registered.");
        }
        bot.sendMessage(parseInt(chatId), "⚠️ Are you sure you want to delete your account? Reply with 'YES' to confirm.");
        bot.once("message", (response) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (((_a = response.text) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "yes") {
                yield globle_1.prisma.user.delete({ where: { telegramId } });
                bot.sendMessage(parseInt(chatId), `🗑️ Your account has been deleted.`);
            }
            else {
                bot.sendMessage(parseInt(chatId), "❌ Account deletion canceled.");
            }
        }));
    }
    catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "❌ Error occurred while deleting your account.");
    }
}));
// /addproject - Add project
bot.onText(/\/addproject (.+)/, (msg, match) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const chatId = msg.chat.id.toString();
    const telegramId = ((_a = msg.from) === null || _a === void 0 ? void 0 : _a.id.toString()) || "";
    try {
        const user = yield globle_1.prisma.user.findUnique({ where: { telegramId } });
        if (!user)
            return bot.sendMessage(chatId, "❌ You must register first with /start.");
        const input = ((_b = match === null || match === void 0 ? void 0 : match[1]) === null || _b === void 0 ? void 0 : _b.split(" ")) || [];
        const [name, githubRepo, githubBranch = "main"] = input;
        if (!name || !githubRepo) {
            return bot.sendMessage(chatId, "⚠️ Usage: /addproject <project_name> <github_repo> [branch]\n\nExample:\n/addproject my-app user/repo main");
        }
        const webhookSecret = crypto_1.default.randomUUID();
        const project = yield globle_1.prisma.project.create({
            data: {
                name,
                githubRepo,
                githubBranch,
                webhookSecret,
                userId: user.id,
            },
        });
        const webhookUrl = `http://localhost:4000/api/webhook/github/${project.id}`;
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
    }
    catch (err) {
        console.error(err);
        bot.sendMessage(chatId, "❌ Failed to register project.");
    }
}));
// /projects - List projects with inline keyboard
bot.onText(/\/projects/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chatId = msg.chat.id.toString();
    const telegramId = ((_a = msg.from) === null || _a === void 0 ? void 0 : _a.id.toString()) || "";
    try {
        const user = yield globle_1.prisma.user.findUnique({
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
    }
    catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "❌ Error occurred while fetching projects.");
    }
}));
// Handle project details via callback
bot.on("callback_query", (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const chatId = (_a = query.message) === null || _a === void 0 ? void 0 : _a.chat.id.toString();
    const projectId = (_b = query.data) === null || _b === void 0 ? void 0 : _b.split("_")[1];
    try {
        const project = yield globle_1.prisma.project.findUnique({ where: { id: projectId } });
        if (!project) {
            return bot.sendMessage(chatId, "❌ Project not found.");
        }
        const projectDetails = `
📦 *Project Details*:
- Name: ${project.name}
- GitHub Repo: ${project.githubRepo}
- Branch: ${project.githubBranch}
- Webhook Secret: \`${project.webhookSecret}\`
    `;
        bot.sendMessage(chatId, projectDetails, { parse_mode: "Markdown" });
    }
    catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "❌ Error occurred while fetching project details.");
    }
}));
console.log("🤖 Telegram bot is running...");
