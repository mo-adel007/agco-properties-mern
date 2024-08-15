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
  getProjectsByQuery,
  getProjectByAdvancedSearch,
  // searchProjectsByName,
  searchProjectsByAltText
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createProject);
router.put("/update/:id", verifyToken, updateProject);
router.delete("/delete/:id", verifyToken, deleteProject);
router.get("/get/:id", getProject);
router.get("/", getProjects);
router.get("/featured-projects", getFeaturedProject);
router.get("/projects/:type", getProjectByType);
router.get("/projects/developer/:developer", getProjectByDeveloper);
router.get("/projects/community/:community", getProjectByCommunity);
router.get("/search", getProjectsByQuery);
router.get("/advanced-search",getProjectByAdvancedSearch);
router.get("/search-by-alt-text", searchProjectsByAltText);



export default router;
