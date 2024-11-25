import express from "express";
import {
  createAgent,
  publishAgent,
  unpublishAgent,
  getAllAgents,
  getPublishedAgents,
  getAgentById,
  updateAgentById,
getAgentBySlug
} from "../controllers/agents.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createAgent);
router.put("/agents/:id", verifyToken, updateAgentById);
router.put("/agents/:id/publish", verifyToken, publishAgent);
router.put("/agents/:id/unpublish", verifyToken, unpublishAgent);
router.get("/allAgents",getAllAgents);
router.get("/publishedAgents",getPublishedAgents);
router.get("/agent/:id", getAgentById);
router.get('/:slug', getAgentBySlug);

export default router;
