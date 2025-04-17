import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from '../models/listing.model.js';
import Project from '../models/project.model.js';

dotenv.config({ path: '../../.env' });

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

async function checkDuplicateIds(model, modelName) {
  try {
    const duplicates = await model.aggregate([
      {
        $group: {
          _id: "$_id",
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    if (duplicates.length > 0) {
      console.log(`\nDuplicate IDs found in ${modelName}:`);
      console.log(duplicates);
    } else {
      console.log(`\nNo duplicate IDs found in ${modelName}`);
    }
  } catch (error) {
    console.error(`Error checking duplicates in ${modelName}:`, error);
  }
}

async function checkDuplicateSlugs(model, modelName) {
  try {
    const duplicates = await model.aggregate([
      {
        $group: {
          _id: "$slug",
          count: { $sum: 1 },
          ids: { $push: "$_id" }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    if (duplicates.length > 0) {
      console.log(`\nDuplicate slugs found in ${modelName}:`);
      console.log(duplicates);
    } else {
      console.log(`\nNo duplicate slugs found in ${modelName}`);
    }
  } catch (error) {
    console.error(`Error checking duplicate slugs in ${modelName}:`, error);
  }
}

async function runChecks() {
  try {
    await connectDB();

    // Check Listings
    await checkDuplicateIds(Listing, 'Listings');
    await checkDuplicateSlugs(Listing, 'Listings');

    // Check Projects
    await checkDuplicateIds(Project, 'Projects');
    await checkDuplicateSlugs(Project, 'Projects');

    mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error running checks:', error);
    process.exit(1);
  }
}

runChecks();
