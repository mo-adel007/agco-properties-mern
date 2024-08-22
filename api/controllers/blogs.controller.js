// controllers/blogs.controller.js
import Post from "../models/blogs.model.js";
import slugify from "slugify";

// Create a new blog post
export const createPost = async (req, res) => {
  try {
    const { title, summary, content, cover, category, blogAuthor,altText } = req.body;

    // Generate a slug from the title
    const slug = slugify(title, { lower: true, strict: true });

    // Check if a post with the same slug already exists
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return res.status(400).json({ message: "A post with this title already exists. Please use a different title." });
    }

    const newPost = new Post({
      title,
      slug, // Store slug
      summary,
      content,
      cover, // Store URL
      category,
      blogAuthor,
      isPublished: false,
      altText // New posts are unpublished by default
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({ message: "Failed to create blog post." });
  }
};

// Get all blog posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("blogAuthor", "name"); // Populating the author's name
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({ message: "Failed to fetch blog posts." });
  }
};

// Update a blog post
export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, summary, content, cover, category, blogAuthor, altText } = req.body;

    // Generate a new slug if the title is updated
    const slug = title ? slugify(title, { lower: true, strict: true }) : undefined;

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $set: { altText,title, summary, content, cover, category, blogAuthor, ...(slug && { slug }) },
      },
      { new: true, runValidators: true }
    );
    if (req.body.altText !== undefined) updatedPost.altText = req.body.altText;
    if (req.body.title !== undefined) updatedPost.title = req.body.title;
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).json({ message: "Failed to update blog post." });
  }
};

// Toggle publish status of a blog post
export const togglePublishStatus = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find the post and toggle its publish status
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    post.isPublished = !post.isPublished;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Error toggling publish status:", error);
    res.status(500).json({ message: "Failed to toggle publish status." });
  }
};

// Get a single blog post by ID
export const getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find the post by ID and populate the author's name
    const post = await Post.findById(postId).populate("blogAuthor", "name");

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    res.status(500).json({ message: "Failed to fetch blog post." });
  }
};

export const searchPostsByAltText = async (req, res) => {
  try {
    const { altText } = req.query;
    const posts = await Post.find({
      altText: { $regex: altText, $options: "i" },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error searching posts", error });
  }
};
