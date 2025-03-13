// cleanListingSlugs.js
import mongoose from "mongoose";
import Listing from "../models/listing.model.js"; // adjust import path as needed
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: '../../.env' });

// Connect to MongoDB using the connection string from .env
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

// A function to clean a slug using the new rules
const cleanSlug = (name, unitNumber) => {
  let slug = name
    .toLowerCase()
    // Replace pipe characters with a space
    .replace(/\|/g, " ")
    // Remove unwanted characters
    .replace(/[^\w\s-]/g, "")
    .trim()
    // Replace any sequence of whitespace with a single dash
    .replace(/\s+/g, "-")
    // Replace multiple dashes with a single dash
    .replace(/-+/g, "-");

  if (unitNumber) {
    slug = `${slug}-${unitNumber}`;
  }
  return slug;
};

async function updateAllSlugs() {
  try {
    const listings = await Listing.find({});
    console.log(`Found ${listings.length} listings to update.`);
    for (const listing of listings) {
      // Only update if there's a name; you could also add checks if you want
      if (listing.name) {
        // Clean the slug using the new logic
        const newSlug = cleanSlug(listing.name, listing.unitNumber);
        if (listing.slug !== newSlug) {
          listing.slug = newSlug;
          await listing.save();
          console.log(`Updated slug for listing ${listing._id} => ${newSlug}`);
        } else {
          console.log(`Listing ${listing._id} already has the correct slug.`);
        }
      }
    }
    console.log("All slugs updated successfully!");
  } catch (error) {
    console.error("Error updating slugs:", error);
  }
}

// Run the update after connecting to the DB
const runUpdate = async () => {
  await connectDB();
  await updateAllSlugs();
  mongoose.connection.close();
};

runUpdate();
