import express from "express";
import {
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
getDeveloper,
getAllDevelopers,
} from "../controllers/developer.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();
// GET route to fetch all developers
router.get("/developers", getAllDevelopers);
// Create a new developer
router.post("/create", createDeveloper);
router.get("/:slug", getDeveloper);
// Update an existing developer
router.put("/update/:id",verifyToken, updateDeveloper);

// Delete an existing developer
router.delete("/delete/:id",verifyToken, deleteDeveloper);

export default router;

