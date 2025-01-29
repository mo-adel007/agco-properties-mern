    import mongoose from "mongoose";
    const agentSchema = new mongoose.Schema({
    imageUrls: {
        type: [String],
        required: true, // Make imageUrls required
    },
    title: {
        type: String,
        required: true, // Make title required
    },
    name: {
        type: String,
        required: true, // Make name required
    },
email: {type: String, required: false},
pageMetaTitle: {type:String},
phoneNumber: {type: String, required: false},
numberOfListings: {type:Number},
isPublished: { type: Boolean },
slug: {type:String, required: true, unique:true},
languages: {
    type: [String],
    required: true, // Ensure languages are required
  },
nationality: {type: String, required: true},
    });
agentSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    // Generate slug by replacing spaces with hyphens and making it lowercase
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  }
  next();
});
    const Agent = mongoose.model("Agent", agentSchema);

    export default Agent;
