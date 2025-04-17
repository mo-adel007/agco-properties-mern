import mongoose from 'mongoose';
import readline from 'readline';
import Listing from '../models/listing.model.js';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

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
    // Find all listings where userRef doesn't exist in the users collection
    const orphanedListings = await Listing.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userRef',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $match: {
          user: { $size: 0 }
        }
      }
    ]);

    return orphanedListings;
  } catch (error) {
    console.error('Error finding orphaned listings:', error);
    return [];
  }
}

async function getAllUsers() {
  try {
    return await User.find({}).select('_id username email role');
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

async function reassignListings() {
  try {
    await connectDB();

    // Find orphaned listings
    const orphanedListings = await findOrphanedListings();
    
    if (orphanedListings.length === 0) {
      console.log('\n🔍 No orphaned listings found.');
      process.exit(0);
    }

    console.log(`\n🔍 Found ${orphanedListings.length} orphaned listings:`);
    orphanedListings.forEach((listing, index) => {
      console.log(`${index + 1}. ${listing.name} (ID: ${listing._id})`);
    });

    // Get all users
    const users = await getAllUsers();
    
    if (users.length === 0) {
      console.log('\n❌ No users found in the system.');
      process.exit(1);
    }

    console.log('\n👥 Available users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email}) - ${user.role}`);
    });

    // Get user selection
    const selection = await question('\n📝 Enter the number of the user to reassign listings to: ');
    const selectedUser = users[parseInt(selection) - 1];

    if (!selectedUser) {
      console.log('\n❌ Invalid selection');
      process.exit(1);
    }

    // Confirm action
    const confirm = await question(`\n⚠️ Are you sure you want to reassign ${orphanedListings.length} listings to ${selectedUser.username}? (y/n): `);

    if (confirm.toLowerCase() !== 'y') {
      console.log('\n❌ Operation cancelled');
      process.exit(0);
    }

    // Update listings
    const result = await Listing.updateMany(
      { _id: { $in: orphanedListings.map(l => l._id) } },
      { $set: { userRef: selectedUser._id } }
    );

    console.log(`\n✅ Successfully reassigned ${result.modifiedCount} listings to ${selectedUser.username}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
    await mongoose.connection.close();
  }
}

// Run the script
reassignListings();
