import mongoose from "mongoose";

const CommunitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrls: [{ type: String }],
  altText: { type: String },
  title: { type: String },
  summary: { type: String },
  description: { type: String },
  developers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Developer" }], // Changed to array of references
  address: { type: String },
  featured: { type: Boolean, default: false },
  userRef: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Community", CommunitySchema);
