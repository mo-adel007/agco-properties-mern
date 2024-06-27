import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    developer: {type: String, required: true},
    community: {type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true},
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    regularPrice: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    size: { type: Number, required: true },
    furnished: { type: Boolean, required: false },
    parking: { type: Boolean, required: false },
    type: { type: String, required: true },
    status: { type: String, required: true },
    category: { type: String, required: true },
    imageUrls: { type: Array, required: true },
    userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: false },
    featured: {type: Boolean, default: false}
  },
  { timestamps: false }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
