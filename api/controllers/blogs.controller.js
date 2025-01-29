// controllers/blogs.controller.js
import Post from "../models/blogs.model.js";
import slugify from "slugify";
import he from 'he';
// Create a new blog post
export const createPost = async (req, res) => {
  try {
    const { title, summary, content, cover, category, blogAuthor, coverAltText, imageAltTexts, slug } = req.body;
    console.log("Incoming imageAltTexts:", imageAltTexts); // Debug log

    const decodedContent = he.decode(content);

    // Ensure imageAltTexts is converted to a Map
    const imageAltTextsMap = imageAltTexts ? new Map(Object.entries(imageAltTexts)) : new Map();

    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return res.status(400).json({ message: "A post with this title already exists. Please use a different title." });
    }

    const newPost = new Post({
      title,
      slug,
      summary,
      content: decodedContent,
      cover,
      category,
      blogAuthor,
      isPublished: false,
      coverAltText,
      imageAltTexts: imageAltTextsMap,
    });

    await newPost.save();

    const savedPost = await Post.findById(newPost._id); // Fetch saved post
    console.log("Saved imageAltTexts in MongoDB:", savedPost.imageAltTexts); // Debug log

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({ message: "Failed to create blog post." });
  }
};


// Get all blog posts
export const getPublishedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isPublished: true }).populate("blogAuthor", "name").limit(8); // Populating the author's name
 // Convert posts to objects and handle Map conversion
    const formattedPosts = posts.map(post => {
      const postObj = post.toObject();
      if (post.imageAltTexts) {
        postObj.imageAltTexts = Object.fromEntries(post.imageAltTexts);
      }
      return postObj;
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({ message: "Failed to fetch blog posts." });
  }
};

export const getAllPosts = async (req,res) => {
try{
const posts = await Post.find().populate("blogAuthor","name");
res.status(200).json(posts);
}
catch(error) {
console.error("Error fetching blog posts: ", error);
res.status(500).json({message:"Failed to fetch blog posts."})
}
};

// Update a blog post
export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    let { title, summary, content, cover, category, blogAuthor, coverAltText, imageAltTexts, slug } = req.body;

    const decodedContent = he.decode(content);

    // Convert imageAltTexts to a Map
    const imageAltTextsMap = imageAltTexts ? new Map(Object.entries(imageAltTexts)) : undefined;

    const updateData = {
      title,
      summary,
      content: decodedContent,
      cover,
      category,
      blogAuthor,
      slug,
      coverAltText,
    };

    if (imageAltTextsMap) {
      updateData.imageAltTexts = imageAltTextsMap;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

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
    const { postSlug } = req.params;
    const post = await Post.findOne({ slug: postSlug }).populate("blogAuthor", "name");

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Convert Map to Object
    const postObject = post.toObject();
    postObject.imageAltTexts = post.imageAltTexts ? Object.fromEntries(post.imageAltTexts) : {};

// Generate meta title
    const metaTitle = `AGCO PROPERTIES | ${postObject.title}`;
    postObject.metaTitle = metaTitle;
    console.log("Fetched imageAltTexts:", postObject.imageAltTexts); // Debug log
   
    res.status(200).json(postObject);
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
