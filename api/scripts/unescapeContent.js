import mongoose from 'mongoose';
import Post from './models/blogs.model.js'; // Adjust the path as necessary
import he from 'he';
import dotenv from 'dotenv';
import Project from './models/project.model.js'; // Adjust the path as necessary
import Listing from './models/listing.model.js'; // Adjust the path as necessary
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

const unescapeContent = async () => {
  try {
    const posts = await Post.find();
    const projects = await Project.find();
    const listings = await Listing.find();
    for (const post of posts) {
      const decodedContent = he.decode(post.content);
      post.content = decodedContent;
      await post.save();
      console.log(`Updated post: ${post.title}`)
}
 for (const project of projects) {
      const decodedDescription = he.decode(project.description);
      project.description = decodedDescription;
      await project.save();
      console.log(`Updated project: ${project.name}`);
    }
for (const listing of listings) {
      const decodedDescription = he.decode(listing.description);
      // Optionally, sanitize the decoded description
      // const sanitizedDescription = sanitizeHtml(decodedDescription); // Uncomment if using sanitizeHtml
      listing.description = decodedDescription; // Update the description with decoded content
      await listing.save();
      console.log(`Updated listing: ${listing.name}`); // Assuming there is a 'name' field
    }
    console.log('All listings have been updated successfully.');
    console.log('All posts have been updated successfully.');
    console.log('All projects have been updated successfully.');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error updating posts:', error);
 console.error('Error updating projects:', error);
    console.error('Error updating listings:', error);
    mongoose.disconnect();
  }

};

unescapeContent();
