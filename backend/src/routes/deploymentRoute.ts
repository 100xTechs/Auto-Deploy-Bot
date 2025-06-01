import { Router } from "express";
import {
  getDeployments,
  getDeployment,
  createDeployment,
  updateDeploymentStatus
} from "../controllers/deploymentController";
import { authenticateToken } from "../middleware";

const deploymentRouter = Router();

// Apply authentication middleware to all routes
deploymentRouter.use(authenticateToken);

deploymentRouter.get("/", getDeployments);
deploymentRouter.get("/:id", getDeployment);
deploymentRouter.post("/", createDeployment);
deploymentRouter.patch("/:id/status", updateDeploymentStatus);

export default deploymentRouter;
