import mongoose from "mongoose";

const pageMetaSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const PageMeta = mongoose.model("PageMeta", pageMetaSchema);

export default PageMeta;
