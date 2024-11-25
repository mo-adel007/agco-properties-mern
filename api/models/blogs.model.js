// models/blogs.model.js
import mongoose from "mongoose";
import slugify from "slugify";
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
PostSchema.pre('validate', function(next) {
  if (this.title) {
    let slug = slugify(this.title, { lower: true, strict: true });
    
    // Ensure uniqueness by appending a counter if necessary
    Post.findOne({ slug }).then(existingPost => {
      if (existingPost && existingPost._id.toString() !== this._id.toString()) {
        const uniqueSlug = `${slug}-${Date.now()}`;
        this.slug = uniqueSlug;
      } else {
        this.slug = slug;
      }
      next();
    }).catch(err => {
      console.error('Error generating slug:', err);
      next(err);
    });
  } else {
    next();
  }
});
const Post = mongoose.model("Post", PostSchema);

export default Post;
