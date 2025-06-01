import { Router } from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectDeployments
} from "../controllers/projectController";
import { authenticateToken } from "../middleware";

const projectRouter = Router();

// Apply authentication middleware to all routes
projectRouter.use(authenticateToken);

projectRouter.get("/", getProjects);
projectRouter.get("/:id", getProject);
projectRouter.post("/", createProject);
projectRouter.put("/:id", updateProject);
projectRouter.delete("/:id", deleteProject);
projectRouter.get("/:id/deployments", getProjectDeployments);

export default projectRouter;
