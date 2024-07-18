import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  developer: { type: String, required: true },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  type: { type: String, required: true },
  imageUrls: { type: Array, required: true },
  featured: { type: Boolean, default: false, required: false },
  status: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
  typeOfUnit: { type: Array, required: true },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
