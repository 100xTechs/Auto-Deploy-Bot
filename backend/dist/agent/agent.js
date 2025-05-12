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
// agent.ts
const express_1 = __importDefault(require("express"));
const globle_1 = require("../utils/globle");
const body_parser_1 = __importDefault(require("body-parser"));
const crypto_1 = __importDefault(require("crypto"));
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const bot = new node_telegram_bot_api_1.default(process.env.BOT_TOKEN, { polling: false });
app.use(body_parser_1.default.json({
    verify: (req, res, buf) => {
        // Store the raw body buffer for signature verification
        req.rawBody = buf;
    },
}));
function verifySignature(secret, payload, signature) {
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
        const hmac = crypto_1.default.createHmac("sha256", secret);
        const digest = "sha256=" + hmac.update(payload).digest("hex");
        return crypto_1.default.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
    }
    catch (error) {
        console.error("Error during signature verification:", error);
        return false;
    }
}
app.post("/api/webhook/github/:projectId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.params.projectId;
    const event = req.headers["x-github-event"];
    // Try both signature formats that GitHub might send
    const signature256 = req.headers["x-hub-signature-256"];
    const signatureSha1 = req.headers["x-hub-signature"];
    const signature = signature256 || signatureSha1;
    // Log all headers to see what's actually coming in from GitHub
    console.log("Webhook received for project:", projectId);
    console.log("Event type:", event);
    console.log("Raw body exists:", !!req.rawBody);
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    try {
        const project = yield globle_1.prisma.project.findUnique({
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
        yield globle_1.prisma.webhookEvent.create({
            data: {
                projectId: project.id,
                eventType: event,
                payload: rawBodyString,
            },
        });
        // Handle the "ping" event (sent when webhook is first configured)
        if (event === "ping") {
            // Send connection confirmation message
            bot.sendMessage(parseInt(project.user.chatId), `✅ GitHub webhook successfully connected to *${project.name}*\n\n📦 Repo: \`${project.githubRepo}\`\n🔧 Webhook ID: \`${payload.hook.id}\``, { parse_mode: "Markdown" });
            return res.status(200).send("Webhook connection successful");
        }
        // Handle regular deployment events (existing code)
        yield globle_1.prisma.deployment.create({
            data: {
                projectId: project.id,
                status: "SUCCESS",
                commitHash: payload.after,
                userId: project.userId,
            },
        });
        // Regular deployment notification
        bot.sendMessage(parseInt(project.user.chatId), `🚀 Deployment triggered for *${project.name}*\n\n📦 Repo: \`${project.githubRepo}\`\n🌿 Branch: \`${project.githubBranch}\`\n🔔 Event: \`${event}\``, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Deploy", callback_data: "deploy" },
                        { text: "Deny", callback_data: "deny" },
                    ],
                ],
            },
        });
        bot.on("callback_query", (query) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            if ((_a = query.data) === null || _a === void 0 ? void 0 : _a.startsWith("project_")) {
                const chatId = (_b = query.message) === null || _b === void 0 ? void 0 : _b.chat.id.toString();
                const projectId = (_c = query.data) === null || _c === void 0 ? void 0 : _c.split("_")[1];
                try {
                    const project = yield globle_1.prisma.project.findUnique({
                        where: { id: projectId },
                    });
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
            }
            const userResponse = query.data; // "deploy" or "deny"
            const userId = query.from.id;
            const userName = query.from.username || query.from.first_name;
            // Log the user response in a comment
            console.log(`User ${userName} (${userId}) selected: ${userResponse}`);
            // Respond to the user action
            if (userResponse === "deploy") {
                bot.sendMessage((_d = query.message) === null || _d === void 0 ? void 0 : _d.chat.id, "✅ Deployment approved and initiated.");
            }
            else if (userResponse === "deny") {
                bot.sendMessage((_e = query.message) === null || _e === void 0 ? void 0 : _e.chat.id, "❌ Deployment denied.");
            }
            // Acknowledge the callback query
            bot.answerCallbackQuery(query.id);
        }));
        res.status(200).send("Webhook received and processed");
    }
    catch (err) {
        console.error("Webhook error:", err);
        res.status(500).send("Internal Server Error");
    }
}));
app.listen(4000, () => {
    console.log("📡 Agent server listening on port 4000");
});
