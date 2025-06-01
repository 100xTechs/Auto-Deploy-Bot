import { Router } from "express";
import { handleGitHubWebhook, getWebhookEvents } from "../controllers/webhookController";
import { authenticateToken } from "../middleware";

const webhookRouter = Router();

// GitHub webhook endpoint (no auth required for webhook calls)
webhookRouter.post("/github/:projectId", handleGitHubWebhook);

// Protected routes for webhook management
webhookRouter.use(authenticateToken);
webhookRouter.get("/events/:projectId", getWebhookEvents);

export default webhookRouter;
