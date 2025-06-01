import { Request, Response } from "express";
import { prisma } from "../globle";

// Get all deployments for a user
export const getDeployments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const deployments = await prisma.deployment.findMany({
      where: { userId },
      include: {
        project: {
          select: { name: true, githubRepo: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to recent deployments
    });

    res.status(200).json({ deployments });
  } catch (error) {
    console.error("Get deployments error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single deployment
export const getDeployment = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const deployment = await prisma.deployment.findFirst({
      where: { id, userId },
      include: {
        project: {
          select: { name: true, githubRepo: true, githubBranch: true }
        }
      }
    });

    if (!deployment) {
      return res.status(404).json({ message: "Deployment not found" });
    }

    res.status(200).json({ deployment });
  } catch (error) {
    console.error("Get deployment error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create manual deployment
export const createDeployment = async (req: any, res: any) => {
  try {
    const { projectId, commitHash, commitMsg } = req.body;
    const userId = (req as any).user.id;

    if (!projectId || !commitHash) {
      return res.status(400).json({ message: "Project ID and commit hash are required" });
    }

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const deployment = await prisma.deployment.create({
      data: {
        projectId,
        userId,
        commitHash,
        commitMsg,
        status: "PENDING",
        triggeredBy: "manual"
      },
      include: {
        project: {
          select: { name: true, githubRepo: true }
        }
      }
    });

    res.status(201).json({ 
      message: "Deployment created successfully", 
      deployment 
    });
  } catch (error) {
    console.error("Create deployment error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update deployment status
export const updateDeploymentStatus = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = (req as any).user.id;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const existingDeployment = await prisma.deployment.findFirst({
      where: { id, userId }
    });

    if (!existingDeployment) {
      return res.status(404).json({ message: "Deployment not found" });
    }

    const deployment = await prisma.deployment.update({
      where: { id },
      data: {
        status,
        deployedAt: status === "SUCCESS" ? new Date() : existingDeployment.deployedAt
      },
      include: {
        project: {
          select: { name: true, githubRepo: true }
        }
      }
    });

    res.status(200).json({ 
      message: "Deployment status updated successfully", 
      deployment 
    });
  } catch (error) {
    console.error("Update deployment status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
