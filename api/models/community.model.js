import mongoose from "mongoose";
const communitySchema = new mongoose.Schema({
  developer: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  imageUrls: { type: Array, required: true },
  featured: { type: Boolean, default: false },
});

const Community = mongoose.model("Community", communitySchema);

export default Community;
