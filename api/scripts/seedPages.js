import mongoose from "mongoose";
import PageMeta from "../models/pageMeta.model.js"; // Adjust the path to your model

// Metadata for seeding
const pages = [
  {
    slug: "home",
    title: "AGCO Properties | Home",
    description: "Welcome to AGCO Properties, your gateway to the best real estate investments.",
  },
  // {
  //   slug: "listing/:listingId",
  //   title: "Property Listing | AGCO Properties",
  //   description: "View detailed information about properties listed on AGCO Properties.",
  // },
  {
    slug: "buy",
    title: "Buy Property | AGCO Properties",
    description: "Explore properties available for purchase with AGCO Properties.",
  },
  {
    slug: "rent",
    title: "Rent Property | AGCO Properties",
    description: "Find properties available for rent with AGCO Properties.",
  },
  {
    slug: "commercial",
    title: "Commercial Properties | AGCO Properties",
    description: "Browse commercial properties for lease or sale through AGCO Properties.",
  },
  {
    slug: "developer",
    title: "Developer Listings | AGCO Properties",
    description: "Discover listings from various property developers on AGCO Properties.",
  },
  {
    slug: "services",
    title: "Our Services | AGCO Properties",
    description: "Learn about the services offered by AGCO Properties to assist with your real estate needs.",
  },
  {
    slug: "price-indicator",
    title: "Price Indicator | AGCO Properties",
    description: "Use our price indicator tool to gauge property values with AGCO Properties.",
  },
  {
    slug: "budget-calculator",
    title: "Budget Calculator | AGCO Properties",
    description: "Calculate your budget for property investment with AGCO Properties' budget calculator.",
  },
  {
    slug: "results",
    title: "Property Search Results | AGCO Properties",
    description: "View search results for properties on AGCO Properties.",
  },
  {
    slug: "projects-results",
    title: "Project Search Results | AGCO Properties",
    description: "Explore search results for property projects on AGCO Properties.",
  },
  {
    slug: "our-properties",
    title: "Our Properties | AGCO Properties",
    description: "Browse the properties available at AGCO Properties.",
  },
  {
    slug: "list-your-property",
    title: "List Your Property | AGCO Properties",
    description: "List your property with AGCO Properties to reach potential buyers or renters.",
  },
  // {
  //   slug: "developer/:developer",
  //   title: "Developer Profile | AGCO Properties",
  //   description: "View detailed profile and listings of a specific property developer.",
  // },
  {
    slug: "new-projects",
    title: "New Projects | AGCO Properties",
    description: "Discover the latest property projects available with AGCO Properties.",
  },
  // {
  //   slug: "project/:projectId",
  //   title: "Project Details | AGCO Properties",
  //   description: "View detailed information about a specific property project.",
  // },
  {
    slug: "blogs",
    title: "Blogs | AGCO Properties",
    description: "Read the latest blogs and articles on real estate from AGCO Properties.",
  },
  // {
  //   slug: "posts/:postId",
  //   title: "Blog Post Details | AGCO Properties",
  //   description: "Read the details of a specific blog post on AGCO Properties.",
  // },
  {
    slug: "price-indicator",
    title: "Price Indicator | AGCO Properties",
    description: "Find your best property with details and using map location.",
  },
  {
    slug: "budget-calculator",
    title: "Budget Calculator | AGCO Properties",
    description: "Find your best property with details and using map location.",
  },
  {
    slug: "overview",
    title: "Overview | AGCO Properties",
    description: "A breif introduction about AGCO Properties.",
  },
  {
    slug: "agents",
    title: "Agents | AGCO Properties",
    description: "A breif introduction about AGCO Properties Agents.",
  },
  {
    slug: "why-dubai",
    title: "why-dubai | AGCO Properties",
    description: "Why to invest in Dubai?.",
  },
  {
    slug: "our-team",
    title: "Team Memebers | AGCO Properties",
    description: "Take a look about or team and if you want to join.",
  },


];

const seedPages = async () => {
    try {
      await mongoose.connect("mongodb+srv://muhamedadelfahmy99:I0EJy2z88wtdxiuY@cluster0.ovpkwoe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true });
  
      // Clear existing data
      await PageMeta.collection.drop().catch(error => {
        if (error.code !== 26) {
          throw error;
        }
        console.log("Collection not found, skipping drop.");
      });
      
      // Insert new data
      for (const page of pages) {
        if (page.slug && page.slug.trim() !== '') {  // Ensure slug is not null or empty
            console.log('Inserting/updating:', { slug: page.slug, title: page.title, description: page.description });
            await PageMeta.updateOne({ slug: page.slug }, page, { upsert: true });
        } else {
          console.log('Skipping invalid page:', page);
        }
      }
      console.log("Pages seeded successfully!");
      mongoose.connection.close();
    } catch (error) {
      console.error("Error seeding pages:", error);
      mongoose.connection.close();
    }
  };
  

seedPages();
