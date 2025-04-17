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
  getProjectByCommunity, // for dashboard and developer page
  getProjectsByCommunity, // for community page
  getProjectsByQuery,
  getProjectByAdvancedSearch,
  searchProjectsByAltText,
getRelatedProjects,
getPriceIndicatorData,
getProjectsBySlug,
searchProjects,
getProjectsWithCounts,
getCommunitiesWithProjectCounts,
projectsByCommunity
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createProject);
router.put("/update/:id", verifyToken, updateProject);
router.delete("/delete/:id", verifyToken, deleteProject);
router.get("/get/:slug", getProject);
router.get("/", getProjects);
router.get("/featured-projects", getFeaturedProject);
router.get("/projects/newProjects", getProjectByType);
router.get("/projects/developer/:developer", getProjectByDeveloper);
router.get("/by-community/:community/:developer", getProjectByCommunity);
router.get("/by-community/:community", getProjectsByCommunity); // Get projects by (community communities page)
router.get("/search", getProjectsByQuery);
router.get("/advanced-search",getProjectByAdvancedSearch);
router.get("/search-by-alt-text", searchProjectsByAltText);
router.get(
  '/related/:developer/:currentProjectId',
  getRelatedProjects
);
router.get('/projects/:communitySlug/:developerSlug', getProjectsBySlug);
router.get('/price-indicator', getPriceIndicatorData);
router.get('/search-projects', searchProjects);
router.get("/with-counts", getProjectsWithCounts); // Add this new route
router.get('/communities', getCommunitiesWithProjectCounts); // Get communities with project counts ( new projects)
router.get('/community/:communityId', projectsByCommunity); // Get projects by community ( new projects)
export default router;
