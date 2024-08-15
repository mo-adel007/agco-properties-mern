// src/models/project.model.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  developer: { type: String, required: true },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
    required: true,
  },
  name: { type: String, required: true },
  summary: { type: String, required: false },
  description: { type: String, required: true },
  type: { type: String, required: true },
  imageUrls: { type: Array, required: true },
  address: {type:String,required:true},
  featured: { type: Boolean, default: false, required: false },
  status: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
  typeOfUnit: { type: Array, required: true },
  latitude: { type: Number, required: true }, // New field
  longitude: { type: Number, required: true }, // New field
  altText: { type: String },
  title: { type: String },
  userRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Make sure this exists

});

const Project = mongoose.model("Project", projectSchema);

export default Project;