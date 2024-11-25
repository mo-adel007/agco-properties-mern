// routes/blogs.routes.js
import express from "express";
import {
  createPost,
  getPublishedPosts,
  updatePost,
  togglePublishStatus,
  getPost,
  searchPostsByAltText,
getAllPosts,
  // searchBlogsByName
} from "../controllers/blogs.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Route to create a new post
router.post("/create", verifyToken, createPost);

// Route to get all posts
router.get("/", getPublishedPosts);
router.get("/get/:postSlug", getPost);
router.get("/allPosts", verifyToken, getAllPosts);
// Route to update a post
router.put("/posts/:postId", verifyToken, updatePost);

// Toggle publish status of a post
router.post('/toggle-publish/:postId',verifyToken, togglePublishStatus);

router.get("/search-by-alt-text", searchPostsByAltText);


export default router;
