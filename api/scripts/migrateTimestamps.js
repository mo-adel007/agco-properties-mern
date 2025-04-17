import mongoose from 'mongoose';
import Project from '../models/project.model.js';
import dotenv from 'dotenv';

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

async function migrateTimestamps() {
  try {
    connectDB()

    // Get all projects that need timestamp updates
    const projects = await Project.find({}).lean();
    console.log(`Found ${projects.length} projects to process`);

    // Calculate date range (2 years ago to now)
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getTime() - 2);
    const timeRange = Date.now() - twoYearsAgo.getTime();

    for (const project of projects) {
      try {
        // Use the ObjectId timestamp if available
        let baseDate = project._id.getTimestamp();
        
        // Add some random variation (±30 days) to avoid clustering
        const variation = Math.floor(Math.random() * 60 - 30) * 24 * 60 * 60 * 1000;
        const createdAt = new Date(baseDate.getTime() + variation);
        
        // Set updatedAt to be sometime after createdAt
        const maxUpdateDelay = Date.now() - createdAt.getTime();
        const updateVariation = Math.floor(Math.random() * maxUpdateDelay);
        const updatedAt = new Date(createdAt.getTime() + updateVariation);

        // Update the project with new timestamps
        await Project.findByIdAndUpdate(project._id, {
          $set: {
            createdAt: createdAt,
            updatedAt: updatedAt
          }
        }, { new: true });

        console.log(`Updated timestamps for project: ${project.name}`);
        console.log(`  Created: ${createdAt.toISOString()}`);
        console.log(`  Updated: ${updatedAt.toISOString()}`);
      } catch (error) {
        console.error(`Error updating project ${project._id}:`, error);
      }
    }

    console.log('Timestamp migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrateTimestamps();
