// scripts/generateSlugs.js

import mongoose from 'mongoose';
import Post from './models/blogs.model.js'; // Adjust the path as necessary
import Listing from './models/listing.model.js'; // Adjust the path as necessary
import Developer from './models/developer.model.js'; // Adjust the path as necessary
import Agent from './models/agents.model.js'; // Adjust the path as necessary
import slugify from 'slugify';
import dotenv from 'dotenv';


dotenv.config()
// Connect to MongoDB
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

const generateUniqueSlug = async (model, slug) => {
  let uniqueSlug = slug;
  let count = 1;
  while (await model.findOne({ slug: uniqueSlug })) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }
  return uniqueSlug;
}

const updateListings = async () => {
  try {
    // Find all listings that do not have a createdAt field
    const listingsWithoutCreatedAt = await Listing.find({ createdAt: { $exists: false } });

    console.log(`Found ${listingsWithoutCreatedAt.length} listings without createdAt`);

    for (const listing of listingsWithoutCreatedAt) {
      // Set createdAt using the ObjectId's timestamp
      listing.createdAt = listing._id.getTimestamp();

      // Save the updated listing
      await listing.save();
      console.log(`Updated listing: ${listing.name} with createdAt: ${listing.createdAt}`);
    }

    console.log("Updated all listings without createdAt.");
  } catch (error) {
    console.error("Error updating listings:", error);
  }
};

const generateSlugs = async () => {
  try {
    const posts = await Post.find({ slug: { $exists: false } });
    for (const post of posts) {
      let slug = slugify(post.title, { lower: true, strict: true });
      let uniqueSlug = await generateUniqueSlug(Post, slug);
      post.slug = uniqueSlug;
      await post.save();
      console.log(`Generated slug for post: ${post.title}`);
    }

    const listings = await Listing.find({ slug: { $exists: false } });
    for (const listing of listings) {
      let slug = listing.unitNo
        ? `${slugify(listing.name, { lower: true, strict: true })}-${listing.unitNo}`
        : slugify(listing.name, { lower: true, strict: true });
      listing.slug = await generateUniqueSlug(Listing, slug);
      await listing.save();
      console.log(`Generated slug for listing: ${listing.name}`);
    }

    const developers = await Developer.find({ slug: { $exists: false } });
    for (const developer of developers) {
      let slug = slugify(developer.name, { lower: true, strict: true });
      developer.slug = await generateUniqueSlug(Developer, slug);
      await developer.save();
      console.log(`Generated slug for developer: ${developer.name}`);
    }

    const agents = await Agent.find({ slug: { $exists: false } });
    for (const agent of agents) {
      let slug = slugify(agent.name, { lower: true, strict: true });
      agent.slug = await generateUniqueSlug(Agent, slug);
      await agent.save();
      console.log(`Generated slug for agent: ${agent.name}`);
    }

    console.log('All slugs have been generated successfully.');
  } catch (error) {
    console.error('Error generating slugs:', error);
  }
};

const runScripts = async () => {
  await updateListings();
  await generateSlugs();
  mongoose.disconnect();
};

runScripts();
