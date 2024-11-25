import mongoose from "mongoose";
import slugify from "slugify";
import Project from "./models/project.model.js"; // Adjust based on your file structure
import Community from "./models/community.model.js"; // Adjust based on your file structure
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// MongoDB connection using environment variable
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Script to add slugs to all existing projects
const addSlugsToProjects = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Fetch all projects
    const projects = await Project.find().populate("community", "name");

    for (let project of projects) {
      if (project.community && project.name) {
        // Generate slug based on community name and project name
        const slug = slugify(`${project.community.name}-${project.name}`, { lower: true });

        // Update the project with the new slug
        project.slug = slug;
        await project.save();
        console.log(`Updated project: ${project.name} with slug: ${slug}`);
      } else {
        console.log(`Skipping project: ${project.name} because of missing community or project name`);
      }
    }

    console.log("Slugs have been successfully added to all projects.");
    process.exit();
  } catch (error) {
    console.error("Error adding slugs:", error);
    process.exit(1);
  }
};

// Run the script
addSlugsToProjects();

