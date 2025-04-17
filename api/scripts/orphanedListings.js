import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from '../models/listing.model.js';

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

async function findOrphanedListings() {
  try {
    await connectDB();

    const orphanedListings = await Listing.find({
      $or: [
        { project: null },
        { community: null },
        { developer: null }
      ]
    }).select('name permitNumber project community developer');

    if (orphanedListings.length === 0) {
      console.log('No orphaned listings found');
      return;
    }

    console.log(`\nFound ${orphanedListings.length} orphaned listings:`);
    
    orphanedListings.forEach((listing, index) => {
      const missing = [];
      if (!listing.project) missing.push('project');
      if (!listing.community) missing.push('community');
      if (!listing.developer) missing.push('developer');

      console.log(`\n${index + 1}. Listing Name: ${listing.name}`);
      console.log(`   Permit Number: ${listing.permitNumber || 'Not available'}`);
      console.log(`   Missing References: ${missing.join(', ')}`);
      console.log(`   Document ID: ${listing._id}`);
    });

  } catch (error) {
    console.error('Error finding orphaned listings:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

findOrphanedListings();
