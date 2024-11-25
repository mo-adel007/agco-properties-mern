import express from "express";
import {
  createMember,
  updateMember,
  deleteMember,
getAllTeamMembers, 
getTeamMemberById,
  getPublishedTeamMembers, // New controller
} from "../controllers/member.controller.js"; // Adjust the path as needed

const router = express.Router();

// Route to create a new member
router.post("/create", createMember);

// Route to update an existing member
router.put("/editMember/:id", updateMember);

// Route to delete a member
router.delete("/deleteMember/:id", deleteMember);
router.get("/allTeamMembers", getAllTeamMembers);
router.get("/teamMember/:id", getTeamMemberById);
router.get("/publishedTeamMembers", getPublishedTeamMembers); // New route
export default router;
