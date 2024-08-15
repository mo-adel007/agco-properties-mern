// routes/blogs.routes.js
import express from "express";
import {
  createPost,
  getPosts,
  updatePost,
  togglePublishStatus,
  getPost,
  searchPostsByAltText,
  // searchBlogsByName
} from "../controllers/blogs.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Route to create a new post
router.post("/create", verifyToken, createPost);

// Route to get all posts
router.get("/", getPosts);
router.get("/get/:postId", getPost);

// Route to update a post
router.put("/posts/:postId", verifyToken, updatePost);

// Toggle publish status of a post
router.post('/toggle-publish/:postId', togglePublishStatus);

router.get("/search-by-alt-text", searchPostsByAltText);


export default router;
