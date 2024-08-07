import mongoose from "mongoose";

const CommunitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrls: [{ type: String }],
  altText: { type: String },
  title: { type: String },
  caption: { type: String },
  description: { type: String },
  // other fields
});

export default mongoose.model("Community", CommunitySchema);
