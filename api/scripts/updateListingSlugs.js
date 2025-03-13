// updateListingSlugs.js
import mongoose from "mongoose";
import Listing from "../models/listing.model.js"; // Adjust import path as needed
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: '../../.env' });

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

async function updateSlugs() {
  // Fetch all listings (or use a query if you only want to update certain ones)
  const listings = await Listing.find({});

  for (const listing of listings) {
    // If there's no name or unitNumber, just skip
    if (!listing.name) continue;

    // Convert the listing's name to a URL-friendly slug
    const nameSlug = listing.name.toLowerCase().replace(/\s+/g, "-");

    // If there's a unitNumber, append it to the slug
    let newSlug = listing.unitNumber
      ? `${nameSlug}-${listing._id}`
      : nameSlug;

    // If you already have a slug, you might want to check if you should overwrite it or not
    // For example:
    // if (listing.slug && listing.slug === newSlug) { continue; } // skip if it's already correct

    listing.slug = newSlug;

    // Save the updated listing
    await listing.save();
    console.log(`Updated slug for listing: ${listing._id} => ${listing.slug}`);
  }
}
// Execute the update script
const runUpdate = async () => {
  await connectDB();
  await updateSlugs();
  console.log("All slugs updated successfully!");
  mongoose.connection.close();
};

runUpdate();
