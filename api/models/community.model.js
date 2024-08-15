import mongoose from "mongoose";

const CommunitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrls: [{ type: String }],
  altText: { type: String },
  title: { type: String },
  caption: { type: String },
  description: { type: String },
  developer: { type: String, required: true }, // Add this
  address: { type: String, required: true },   // Add this
  featured: { type: Boolean, default: false }, // Add this
  userRef: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Add this if you're associating the community with a user
});

export default mongoose.model("Community", CommunitySchema);
