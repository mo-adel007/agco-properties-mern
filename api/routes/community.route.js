// src/routes/community.route.js
import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createCommunity,
  updateCommunity,
  deleteCommunity,
  getCommunity,
  getCommunities,
  getFeaturedCommunity,
  getCommunitiesByDeveloper,
  searchCommunitiesByAltText
} from "../controllers/community.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createCommunity);
router.put("/update/:id", verifyToken, updateCommunity);
router.delete("/delete/:id", verifyToken, deleteCommunity);
router.get("/get/:id", getCommunity);
router.get("/communities", getCommunities);
router.get("/featured-communities", getFeaturedCommunity);
router.get("/communities/developer/:developer", getCommunitiesByDeveloper);
router.get("/search-by-alt-text", searchCommunitiesByAltText);


export default router;
