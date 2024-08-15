// models/blogs.model.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // Add slug field
    summary: { type: String, required: true },
    content: { type: String, required: true },
    cover: { type: String }, // URL for the cover image
    blogAuthor: { type: String, required: true },
    category: { type: String, required: true },
    isPublished: { type: Boolean, required: true },
    altText: { type: String },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;
