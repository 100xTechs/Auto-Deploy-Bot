import { Request, Response } from "express";
import { prisma } from "../globle";
import crypto from "crypto";

// GitHub webhook handler
export const handleGitHubWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = req.params.projectId;
    const signature = req.headers['x-hub-signature-256'] as string;
    
    // Handle raw body from webhook
    let payload: string;
    let webhookData: any;
    
    if (Buffer.isBuffer(req.body)) {
      payload = req.body.toString();
      webhookData = JSON.parse(payload);
    } else {
      payload = JSON.stringify(req.body);
      webhookData = req.body;
    }

    // Get project and verify it exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { user: true }
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    // Verify webhook signature
    if (!verifyGitHubSignature(payload, signature, project.webhookSecret || '')) {
      res.status(401).json({ message: "Invalid webhook signature" });
      return;
    }

    const event = req.headers['x-github-event'] as string;
    
    // Log webhook event
    await prisma.webhookEvent.create({
      data: {
        projectId,
        event,
        payload: webhookData,
        receivedAt: new Date()
      }
    });

    // Handle different webhook events
    switch (event) {
      case 'ping':
        await handlePingEvent(projectId, webhookData);
        res.status(200).json({ message: "Webhook connected successfully!" });
        break;
        
      case 'push':
        await handlePushEvent(projectId, webhookData);
        res.status(200).json({ message: "Push event processed" });
        break;
        
      case 'pull_request':
        await handlePullRequestEvent(projectId, webhookData);
        res.status(200).json({ message: "Pull request event processed" });
        break;
        
      default:
        res.status(200).json({ message: `Event ${event} received but not processed` });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Verify GitHub webhook signature
function verifyGitHubSignature(payload: string, signature: string, secret: string): boolean {
  if (!signature) return false;
  
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Handle ping event (when webhook is first connected)
async function handlePingEvent(projectId: string, payload: any): Promise<void> {
  try {
    console.log(`Ping event received for project ${projectId}`);
    
    // Update project to mark webhook as connected
    await prisma.project.update({
      where: { id: projectId },
      data: { 
        webhookConnected: true,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error("Error handling ping event:", error);
  }
}

// Handle push event
async function handlePushEvent(projectId: string, payload: any): Promise<void> {
  try {
    const { ref, head_commit, pusher } = payload;
    
    // Only process pushes to the main branch (or configured branch)
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project) return;
    
    const targetBranch = `refs/heads/${project.githubBranch}`;
    if (ref !== targetBranch) {
      console.log(`Ignoring push to ${ref}, only processing ${targetBranch}`);
      return;
    }

    if (!head_commit) {
      console.log("No head commit found in push payload");
      return;
    }

    // Create deployment record
    const deployment = await prisma.deployment.create({
      data: {
        projectId,
        userId: project.userId,
        commitHash: head_commit.id,
        commitMsg: head_commit.message,
        status: "PENDING",
        triggeredBy: pusher?.name || "webhook"
      }
    });

    console.log(`Created deployment ${deployment.id} for commit ${head_commit.id}`);
    
    // Here you would typically trigger your deployment process
    // For now, we'll just log it and mark it as accepted
    setTimeout(async () => {
      await prisma.deployment.update({
        where: { id: deployment.id },
        data: { status: "ACCEPTED" }
      });
    }, 1000);
    
  } catch (error) {
    console.error("Error handling push event:", error);
  }
}

// Handle pull request event
async function handlePullRequestEvent(projectId: string, payload: any): Promise<void> {
  try {
    const { action, pull_request } = payload;
    
    console.log(`Pull request ${action} for project ${projectId}`);
    
    // You can implement PR-specific logic here
    // For example, create preview deployments for PRs
    
  } catch (error) {
    console.error("Error handling pull request event:", error);
  }
}

// Get webhook events for a project (for debugging/monitoring)
export const getWebhookEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const userId = (req as any).user.id;

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId }
    });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const events = await prisma.webhookEvent.findMany({
      where: { projectId },
      orderBy: { receivedAt: 'desc' },
      take: 50,
      select: {
        id: true,
        event: true,
        receivedAt: true,
        payload: true
      }
    });

    res.status(200).json({ events });
  } catch (error) {
    console.error("Get webhook events error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
