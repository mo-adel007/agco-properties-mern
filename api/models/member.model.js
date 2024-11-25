   import mongoose from "mongoose";
    const teamSchema = new mongoose.Schema({
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
    isPublished: { type: Boolean },
    });

    const Member = mongoose.model("Member", teamSchema);

    export default Member;
