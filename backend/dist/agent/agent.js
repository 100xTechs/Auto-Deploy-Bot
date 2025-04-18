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
    const hmac = crypto_1.default.createHmac("sha256", secret);
    const digest = "sha256=" + hmac.update(payload).digest("hex");
    return crypto_1.default.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}
app.post("/api/webhook/github/:projectId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.params.projectId;
    const signature = req.headers["x-hub-signature-256"];
    const event = req.headers["x-github-event"];
    try {
        const project = yield globle_1.prisma.project.findUnique({
            where: { id: projectId },
            include: { user: true },
        });
        if (!project || !project.webhookSecret) {
            return res.status(404).send("Project not found");
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
        bot.sendMessage(parseInt(project.user.chatId), `🚀 Deployment triggered for *${project.name}*\n\n📦 Repo: \`${project.githubRepo}\`\n🌿 Branch: \`${project.githubBranch}\`\n🔔 Event: \`${event}\``, { parse_mode: "Markdown" });
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
