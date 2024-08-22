import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  developer: { type: String, required: true },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Community",
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Project",
  },
  imageUrls: [{ type: String, required: true }],
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  type: { type: String, enum: ["commercial", "residential"], required: true },
  status: { type: String, enum: ["buy", "rent","sold"], required: true },
  category: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  size: { type: Number, required: true },
  regularPrice: { type: Number, required: true },
  parking: { type: Boolean, required: true },
  furnished: { type: Boolean, required: true },
  isPublished: { type: Boolean, required: true },
  featured: { type: Boolean, required: true },
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  altText: { type: String },
  title: { type: String },
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
