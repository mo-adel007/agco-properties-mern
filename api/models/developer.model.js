import mongoose from "mongoose";

const developerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String, required: true },
  description: { type: String, required: false },
summary: {type: String, required: false},
slug: {type:String, required: false, unique:true},
pageMetaTitle: {type:String},
});
developerSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    // Generate slug by replacing spaces with hyphens and making it lowercase
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  }
  next();
});
const Developer = mongoose.model("Developer", developerSchema);

export default Developer;
