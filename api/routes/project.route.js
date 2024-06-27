// src/routes/project.route.js
import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createProject,
  updateProject,
  deleteProject,
  getProject,
  getProjects,
  getFeaturedProject,
  getProjectByType,
  getProjectByDeveloper,
  getProjectByCommunity,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createProject);
router.post("/update/:id", verifyToken, updateProject);
router.delete("/delete/:id", verifyToken, deleteProject);
router.get("/get/:id", getProject);
router.get("/projects", getProjects);
router.get("/featured-projects", getFeaturedProject);
router.get("/projects/:type", getProjectByType);
router.get("/projects/developer/:developer", getProjectByDeveloper);
router.get("/projects/community/:community", getProjectByCommunity);


export default router;
