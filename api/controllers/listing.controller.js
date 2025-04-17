import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";
import Project from "../models/project.model.js";
import Agent from "../models/agents.model.js";
import Community from '../models/community.model.js'
import Developer from '../models/developer.model.js'
import User from '../models/user.model.js';
import formatRichText from '../utils/textFormatter.js'
import {buildPropertyQuery} from '../utils/queryBuilder.js';
import he from 'he'
import { getCategoriesByType, getCategoryCount, sortCategoriesByCount } from '../utils/categoryHelpers.js';
import { residentialCategories, commercialCategories } from '../constants/categories.js';
function convertCamelCaseToWords(camelCaseString) {
  return camelCaseString.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
}

export const createListing = async (req, res, next) => {
  try {
    const { project, community, agent, name,unitNumber } = req.body;

    // Generate slug from name
    let slug = name
      .toLowerCase()
      .replace(/\|/g, '-')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

if (unitNumber) {
slug = `${slug}-${unitNumber}`
}
    // Check for existing slug
    const existingListing = await Listing.findOne({ slug });
    if (existingListing) {
      return res.status(400).json({ message: "Listing with this slug already exists" });
    }

    // Validate ObjectId for project, community, and agent
    if (
      !mongoose.Types.ObjectId.isValid(project) ||
      !mongoose.Types.ObjectId.isValid(community) ||
      !mongoose.Types.ObjectId.isValid(agent)
    ) {
      return res.status(400).json({ message: "Invalid project, community, or agent ID" });
    }

    // Check if related entities exist
    const [projectExists, communityExists, agentExists] = await Promise.all([
      Project.findById(project),
      Community.findById(community),
      Agent.findById(agent),
    ]);

    if (!projectExists || !communityExists || !agentExists) {
      return res.status(404).json({ message: "Project, community, or agent not found" });
    }

    // Create and save the new listing
    const listing = new Listing({ ...req.body, slug });
    await listing.save();

    return res.status(201).json({ message: "Listing created successfully", listing });
  } catch (error) {
    console.error("Error creating listing:", error);
    next(errorHandler(500, "An error occurred while creating the listing."));
  }
};

export const checkPermitNumber = async (req, res) => {
  try {
    const { permitNumber } = req.body;

    if (!permitNumber) {
      return res.status(400).json({ message: 'Permit number is required' });
    }

    // Check if listing with this permit number exists
    const existingListing = await Listing.findOne({ permitNumber });

    if (existingListing) {
      return res.status(409).json({ 
        exists: true,
        message: 'This DLD/permit number is already associated with an existing listing',
        listingName: existingListing.Name
      });
    }

    return res.status(200).json({
      exists: false,
      message: 'Permit number is available'
    });

  } catch (error) {
    console.error('Error checking permit number:', error);
    res.status(500).json({ 
      message: 'Error checking permit number',
      error: error.message 
    });
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
listing.controller.js  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    const formattedListing = updatedListing.toObject();
    if (formattedListing.description) {
      formattedListing.description = formatRichText(formattedListing.description);
    }
    
    // Fixed the typo here: formattedLisitng -> formattedListing
    res.status(200).json(formattedListing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    console.log(`User ID: ${req.user.id}, Listing User ID: ${listing.userRef}, User Role: ${req.user.role}`);

    // Allow the listing creator or a Super Admin to delete the listing
    if (req.user.id !== listing.userRef.toString() && req.user.role !== "Super Admin") {
      return next(errorHandler(401, "You are not authorized to delete this listing!"));
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Listing has been deleted!" });
  } catch (error) {
    next(error);
  }
};

export const publishListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    console.log(`User ID: ${req.user.id}, Listing User ID: ${listing.userRef}, User Role: ${req.user.role}`);

    // Allow the listing creator or a Super Admin to publish the listing
    if (req.user.role === "Admin" || req.user.role === "Super Admin") {
      listing.isPublished = true;
      await listing.save();
      res.status(200).json({ message: "Listing published" });
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    next(error);
 if (!listings.length) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "No listings found matching the criteria!"
      });
    }

    return res.status(200).json({
      success: true,
      listings: listings,
    });
  }
};

export const unpublishListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    console.log(`User ID: ${req.user.id}, Listing User ID: ${listing.userRef}, User Role: ${req.user.role}`);

    // Allow the listing creator or a Super Admin to unpublish the listing
    if (req.user.role === "Admin" || req.user.role === "Super Admin") {
      listing.isPublished = false;
      await listing.save();
      res.status(200).json({ message: "Listing unpublished" });
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    next(error);
  }
}; 
export const getListingBySlug = async (req, res, next) => {
  try {
    // Fetch the listing by slug instead of ID
    let listing = await Listing.findOne({ slug: req.params.slug }) // Change to findOne using slug
      .populate({
        path: "project",
        select: "name slug latitude longitude imageUrls developer deliveryDate address downPaymentPercentage typeOfUnit", // Include the project name and coordinates
        populate: {
          // Nested populate for developer through project
          path: 'developer',
          select: 'name'
        }
      })
      .populate({
        path: "community",
        select: "name", // Include the community name
      })
      .populate({
        path: "agent", // Include the agent information
        select: "name title imageUrls slug", // Select the agent fields you want to include
      });

    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    listing = listing.toObject();
    if (listing.description) {
      listing.description = formatRichText(listing.description);
    }
    // Generate meta title
    const metaTitle = `AGCO PROPERTIES | ${listing.name}`;
    const metaDescription = `AGCO PROPERTIES | ${listing.description}`
    listing.pageTitle = metaTitle;
listing.metaDescription= metaDescription;
    listing.amenities = Object.fromEntries(
      Object.entries(listing.amenities || {})
        .filter(([key, value]) => value)
        .map(([key, value]) => [convertCamelCaseToWords(key), value])
    );

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    let listing = await Listing.findById(req.params.id)
      .populate({
        path: "project",
        select: "name latitude longitude imageUrls developer deliveryDate address downPaymentPercentage typeOfUnit", // Include the project name and coordinates
      })
      .populate({
        path: "community",
        select: "name", // Include the community name
      })
      .populate({
        path: "agent", // Include the agent information
        select: "name title imageUrls", // Select the agent fields you want to include
      });

    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
listing = listing.toObject();
    listing.amenities = Object.fromEntries(
      Object.entries(listing.amenities || {}).filter(([key, value]) => value).map(([key, value]) => [convertCamelCaseToWords(key), value])
    );
if(listing.description) {
listing.description = formatRichText(listing.description);
}
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
export const getPublishedListings = async (req, res, next) => {
  try {
    let listings = await Listing.find({ isPublished: true })
      .populate({path: "project", select: "name latitude longitude"})
      .populate({path: "community", select: "name"})
      .populate({
        path: "agent",
        select: "name title imageUrls slug"
      })


    const formattedListings = listings.map(listing => {
      const listingObj = listing.toObject();

      // Format description if it exists
      if (listingObj.description) {
        listingObj.description = formatRichText(listingObj.description);
      }

      // Format amenities
      listingObj.amenities = Object.fromEntries(
        Object.entries(listingObj.amenities || {})
          .filter(([_, value]) => value)
          .map(([key, value]) => [convertCamelCaseToWords(key), value])
      );

      return listingObj;
    });

    res.status(200).json(formattedListings);
  } catch (error) {
    console.error("Error fetching published listings:", error);
    next(error);
  }
};

// Get listings by status (buy/rent)
export const getListingsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 15, category, community } = req.query;

    // Parse pagination parameters
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    // Build query object
    const query = {
      status,
      type: "residential",
      isPublished: true
    };

    // Add filters based on parameters
    if (category) {
      query.category = category;
    }

    // If community is provided, add it to the query
    if (community) {
      try {
        query.community = new mongoose.Types.ObjectId(community);
      } catch (error) {
        console.error("Invalid community ID:", error);
        return res.status(400).json({ message: "Invalid community ID" });
      }
    }

    const [listings, total] = await Promise.all([
      Listing.find(query)
        .populate("project", "name")
        .populate("community", "name")
        .populate({
          path: "agent",
          select: "name title imageUrls slug",
        })
        .populate({
          path: "developer",
          select: "name logoUrl"
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Listing.countDocuments(query)
    ]);

    // Get communities with listing counts if category is selected
    let communities = [];
    if (category && !community) {
      communities = await Community.aggregate([
        {
          $lookup: {
            from: "listings",
            let: { communityId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$community", "$$communityId"] },
                      { $eq: ["$status", status] },
                      { $eq: ["$type", "residential"] },
                      { $eq: ["$category", category] },
                      { $eq: ["$isPublished", true] }
                    ]
                  }
                }
              }
            ],
            as: "listings"
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            slug: 1,
            imageUrls: 1,
            listingCount: { $size: "$listings" }
          }
        },
        {
          $match: {
            listingCount: { $gt: 0 }
          }
        },
        {
          $sort: { listingCount: -1 }
        }
      ]);
    }

    // Format listings data
    const formattedListings = listings.map(listing => ({
      ...listing,
      developerLogo: listing.developer?.logoUrl || null,
      amenities: Object.entries(listing.amenities || {})
        .filter(([_, value]) => value === true)
        .reduce((acc, [key]) => {
          acc[key] = true;
          return acc;
        }, {})
    }));

    res.status(200).json({
      listings: formattedListings,
      communities: communities.length > 0 ? communities : undefined,
      pagination: {
        currentPage: parsedPage,
        totalPages: Math.ceil(total / parsedLimit),
        totalItems: total,
        hasNextPage: parsedPage < Math.ceil(total / parsedLimit),
        hasPrevPage: parsedPage > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get listings by type (commercial)
export const getListingsByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 15, category, community } = req.query;

    // Parse pagination parameters
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    // Build base query object
    const query = {
      type,
      status: { $in: ["buy", "rent"] },
      isPublished: true
    };

    // Add filters based on parameters
    if (category && commercialCategories.includes(category)) {
      query.category = category;
    }

    // If community is provided, add it to the query
    if (community) {
      try {
        query.community = new mongoose.Types.ObjectId(community);
      } catch (error) {
        console.error("Invalid community ID:", error);
        return res.status(400).json({ message: "Invalid community ID" });
      }
    }

    // Get listings with pagination
    const [listings, total] = await Promise.all([
      Listing.find(query)
        .populate("project", "name")
        .populate("community", "name")
        .populate({
          path: "agent",
          select: "name title imageUrls slug",
        })
        .populate({
          path: "developer",
          select: "name logoUrl"
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Listing.countDocuments(query)
    ]);

    // Format listings data
    const formattedListings = listings.map(listing => ({
      ...listing,
      developerLogo: listing.developer?.logoUrl || null,
      amenities: Object.entries(listing.amenities || {})
        .filter(([_, value]) => value === true)
        .reduce((acc, [key]) => {
          acc[key] = true;
          return acc;
        }, {})
    }));

    // Get communities with their listing counts if category is selected
    let communities = [];
    if (category && !community) {
      communities = await Community.aggregate([
        {
          $lookup: {
            from: "listings",
            let: { communityId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$community", "$$communityId"] },
                      { $eq: ["$type", type] },
                      { $in: ["$status", ["buy", "rent"]] },
                      { $eq: ["$isPublished", true] },
                      { $eq: ["$category", category] }
                    ]
                  }
                }
              }
            ],
            as: "listings"
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            slug: 1,
            imageUrls: 1,
            listingCount: { $size: "$listings" }
          }
        },
        {
          $match: {
            listingCount: { $gt: 0 }
          }
        },
        {
          $sort: { listingCount: -1 }
        }
      ]);
    }

    res.status(200).json({
      listings: formattedListings,
      communities: communities.length > 0 ? communities : undefined,
      pagination: {
        currentPage: parsedPage,
        totalPages: Math.ceil(total / parsedLimit),
        totalItems: total,
        hasNextPage: parsedPage < Math.ceil(total / parsedLimit),
        hasPrevPage: parsedPage > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedListings = async (req, res, next) => {
  try {
    let featuredListings = await Listing.find({
      isPublished: true,
      featured: true,
    })
      .populate("project", "name")
      .populate("community", "name")
 .populate({
        path: "agent", // Include the agent information
        select: "name title imageUrls slug", // Select the agent fields you want to include
      }).sort({createdAt: -1})
  featuredListings = featuredListings.map(listing => {
      let listingObj = listing.toObject();
      listingObj.amenities = Object.fromEntries(
        Object.entries(listingObj.amenities || {}).filter(([key, value]) => value)
      );
      return listingObj;
    });
    res.status(200).json(featuredListings);
  } catch (error) {
    next(error);
  }
};

export const getListingsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    let listings = await Listing.find({ category, isPublished: true }) .populate({
        path: "agent", // Include the agent information
        select: "name title imageUrls slug", // Select the agent fields you want to include
      }).sort({createdAt: -1})
 listings = listings.map(listing => {
      let listingObj = listing.toObject();
      listingObj.amenities = Object.fromEntries(
        Object.entries(listingObj.amenities || {}).filter(([key, value]) => value)
      );
      return listingObj;
    });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
export const getListingByProject = async (req, res, next) => {
  try {
    const { name } = req.params;

    // Case-insensitive search for the project name
    const project = await Project.findOne({
      name: new RegExp(`^${name}$`, "i"),
    })
    console.log("Project found:", project); // Debug log

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    let listings = await Listing.find({
      project: project._id, // Use project._id to search listings
      isPublished: true,
    }).populate("project", "name")
 .populate({
        path: "agent", // Include the agent information
        select: "name title imageUrls slug", // Select the agent fields you want to include
      }).sort({createdAt: -1})
    console.log("Listings found:", listings); // Debug log

    if (listings.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No listings found for this project",
        });
    }
 listings = listings.map(listing => {
      let listingObj = listing.toObject();
      listingObj.amenities = Object.fromEntries(
        Object.entries(listingObj.amenities || {}).filter(([key, value]) => value)
      );
      return listingObj;
    });
    res.status(200).json({ success: true, listings });
  } catch (error) {
    console.error("Error fetching listings by project:", error); // Debug log
    next(error);
  }
};

export const getListingsByQuery = async (req, res, next) => {
  try {
    const {
      isBuying,
      totalBudget,
      yearlyPayment,
      unitType,
      location,
      developer,
      community,
      project,
    } = req.body;

    let query = { isPublished: true };

    if (isBuying) {
      if (totalBudget) query.regularPrice = { $lte: totalBudget };
    } else {
      if (yearlyPayment) query.regularPrice = { $lte: yearlyPayment };
    }

    if (unitType) query.category = unitType;
    if (location) query.address = new RegExp(location, "i");
    if (developer) query.developer = developer;
    if (community) query.community = community;
    if (project) query.project = project;

    const listings = await Listing.find(query)
      .populate("project", "name")
      .populate("community", "name")
      .populate({
        path: "agent",
        select: "name title imageUrls slug",
      })
	.sort({createdAt: -1})
      .lean()
      

    // Fetch developer information for all listings
    const listingsWithDeveloperInfo = await Promise.all(
      listings.map(async (listing) => {
        const developerInfo = await Developer.findOne(
          { name: listing.developer },
          'name logoUrl slug'
        ).lean();

        return {
          ...listing,
          developerLogo: developerInfo?.logoUrl || null
        };
      })
    );

    res.status(200).json(listingsWithDeveloperInfo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const getListingsByQueryParams = async (req, res) => {
  try {
    // Extract all query parameters with defaults
    // page and limit have default values for pagination
    const { 
      type,           // commercial or residential
      status,         // buy or rent
      category,       // property category (Villa, Apartment, etc.)
      bedrooms,       // number of bedrooms
      isPublished,    // publication status
      page = 1,       // current page (default: 1)
      limit = 15      // items per page (default: 15)
    } = req.query;

    // Log incoming query parameters for debugging
    console.log("Received query params:", req.query);

    // Parse pagination parameters to ensure they're numbers
    // Use logical OR to provide fallback values if parsing fails
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 15;
    
    // Calculate offset for pagination
    // Example: page 1 = offset 0, page 2 = offset 15, page 3 = offset 30
    const offset = (parsedPage - 1) * parsedLimit;

    // Initialize base query object
    // These conditions are always applied regardless of filters
    let query = {
      isPublished: true,           // Only show published listings
      status: { $ne: "sold" }      // Exclude sold properties
    };

    // Property Type Filter
    // Validates and adds type filter if provided
    if (type) {
      // Validate type is either commercial or residential
      if (!["commercial", "residential"].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid property type. Must be either 'commercial' or 'residential'"
        });
      }
      query.type = type;
    }

    // Status Filter (Buy/Rent)
    // Validates and adds status filter if provided
    if (status) {
      // Validate status is either Buy or Rent (case sensitive)
      if (!["Buy", "Rent"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Must be either 'Buy' or 'Rent'"
        });
      }
      // Convert status to lowercase to match database values
      query.status = status.toLowerCase();
    }

    // Category Filter
    // Adds category filter without validation (assuming valid categories from frontend)
    if (category) {
      query.category = category;
    }

    // Bedrooms Filter
    // NEW: Added explicit bedrooms filter
    if (bedrooms) {
      // Convert bedrooms string to number and validate
      const bedroomsNum = parseInt(bedrooms);
      if (!isNaN(bedroomsNum)) {
        // Only add to query if it's a valid number
        query.bedrooms = bedroomsNum;
      }
    }

    // Log final query for debugging
    console.log("Final query:", query);

    // Get total count of matching documents for pagination
    const totalListings = await Listing.countDocuments(query);

    // Fetch listings with pagination and populate related data
    const listings = await Listing.find(query)
      // Populate project data
      .populate({
        path: "project",
        select: "name latitude longitude"
      })
      // Populate community data
      .populate("community", "name")
      // Populate agent data
      .populate({
        path: "agent",
        select: "name title imageUrls slug",
      })
      // Populate developer data
      .populate({
        path: "developer",
        select: "name logoUrl slug"
      })
      // Sort by creation date (newest first)
      .sort({createdAt: -1})
      // Apply pagination
      .skip(offset)
      .limit(parsedLimit)
      // Convert to plain JavaScript object
      .lean();

    // Transform listings to include only necessary data
    // This helps reduce response size and standardize the format
    const listingsWithFormattedData = listings.map(listing => ({
      id: listing._id,
      name: listing.name,
      address: listing.address,
      type: listing.type,
      status: listing.status,
      category: listing.category,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      size: listing.size,
      regularPrice: listing.regularPrice,
      imageUrls: listing.imageUrls,
      project: listing.project,
      community: listing.community,
      agent: listing.agent,
      developer: listing.developer,
      developerLogo: listing.developer?.logoUrl || null,
      latitude: listing.latitude,
      longitude: listing.longitude,
      slug: listing.slug,
      description: listing.description,
    }));

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalListings / parsedLimit);
    const hasNextPage = parsedPage < totalPages;
    const hasPrevPage = parsedPage > 1;

    // Return successful response with data and pagination info
    return res.status(200).json({
      success: true,
      count: listingsWithFormattedData.length,
      data: listingsWithFormattedData,
      pagination: {
        currentPage: parsedPage,
        totalPages,
        totalItems: totalListings,
        itemsPerPage: parsedLimit,
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error) {
    // Log error for debugging
    console.error("Server error:", error);
    
    // Return error response
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};



export const getListingsByAdvancedSearch = async (req, res, next) => {
  try {
    const {
      option,
      category,
      bedrooms,
      location,
      minArea,
      maxArea,
      minPrice,
      maxPrice,
      parking,
      furnished,
      page = 1,
      limit = 15
    } = req.query;

    console.log("Received query params:", req.query);

    // Parse pagination parameters
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 15;
    const offset = (parsedPage - 1) * parsedLimit;

    let query = { isPublished: true };

    // Handle property type and status
    if (option) {
      if (option.includes("Commercial")) {
        query.type = "commercial";
        query.status = option.includes("Buy") ? "buy" : "rent";
      } else {
        query.type = "residential";
        query.status = option.toLowerCase();
      }
    }

    // Handle category and bedrooms with proper type conversion
    if (category) query.category = category;
    if (bedrooms) query.bedrooms = parseInt(bedrooms);

    // Handle location search
    if (location) query.address = new RegExp(location, "i");

    // Handle area range with proper type conversion
    if (minArea || maxArea) {
      query.size = {};
      if (minArea) query.size.$gte = parseInt(minArea);
      if (maxArea) query.size.$lte = parseInt(maxArea);
    }

    // Handle price range with proper type conversion
    if (minPrice || maxPrice) {
      query.regularPrice = {};
      if (minPrice) query.regularPrice.$gte = parseInt(minPrice);
      if (maxPrice) query.regularPrice.$lte = parseInt(maxPrice);
    }

    // Handle boolean filters
    if (parking && parking.toLowerCase() === "true") {
      query.parking = true;
    }
    if (furnished && furnished.toLowerCase() === "true") {
      query.furnished = true;
    }

    console.log("Final query:", query);

    // Get total count for pagination
    const totalListings = await Listing.countDocuments(query);

    // Fetch listings with pagination
    const listings = await Listing.find(query)
      .populate("project", "name")
      .populate("community", "name")
      .populate({
        path: "agent",
        select: "name title imageUrls slug",
      })
      .populate({
        path: "developer",
        select: "name logoUrl slug"
      })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(parsedLimit)
      .lean();

    // Format the response data
    const listingsWithFormattedData = listings.map(listing => ({
      ...listing,
      developerLogo: listing.developer?.logoUrl || null
    }));

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalListings / parsedLimit);
    const hasNextPage = parsedPage < totalPages;
    const hasPrevPage = parsedPage > 1;

    // Send response with pagination info
    res.status(200).json({
      success: true,
      count: listingsWithFormattedData.length,
      data: listingsWithFormattedData,
      pagination: {
        currentPage: parsedPage,
        totalPages,
        totalItems: totalListings,
        itemsPerPage: parsedLimit,
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};



export const getStartingPriceByProject = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const lowestPriceListing = await Listing.findOne({ project: projectId, isPublished: true })
      .sort('regularPrice')
      .select('regularPrice')
      .limit(12);

    if (!lowestPriceListing) {
      return res.status(404).json({ success: false, message: 'No listings found for this project' });
    }

    res.status(200).json({ success: true, startingPrice: lowestPriceListing.regularPrice });
  } catch (error) {
    next(error);
  }
};

export const getAllListings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const totalListings = await Listing.countDocuments({});

    let listings = await Listing.find({})
      .populate('userRef', 'username')
      .populate("project", "name")
      .populate("community", "name")
      .populate({
        path: "agent",
        select: "name title imageUrls slug",
      })
	.sort({createdAt: -1})
      .skip(skip)
      .limit(limit);

    console.log("Listings from DB:", listings);

    listings = listings.map(listing => {
      let listingObj = listing.toObject();
      listingObj.amenities = Object.fromEntries(
        Object.entries(listingObj.amenities || {}).filter(([key, value]) => value)
      );
      return listingObj;
    });

    res.status(200).json({
      listings,
      currentPage: page,
      totalPages: Math.ceil(totalListings / limit),
      hasMore: skip + listings.length < totalListings
    });
  } catch (error) {
    console.error("Error fetching all listings:", error);
    next(error);
  }
};

export const markAsSold = async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.isPublished) {
      return res.status(400).json({ message: "Listing must be unpublished before marking as sold" });
    }

    listing.status = "sold";
    await listing.save();

    res.status(200).json({ message: "Listing marked as sold successfully", listing });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark listing as sold", error });
  }
};

export const getSuccessfulListings = async (req, res) => {
  try {
    let successfulListings = await Listing.find({ isPublished: false, status: "sold" })
      .populate("community")
      .populate("project")
      .populate("userRef")
 .populate({
        path: "agent", // Include the agent information
        select: "name title imageUrls slug", // Select the agent fields you want to include
      }).sort({createdAt: -1})
 successfulListings = successfulListings.map(listing => {
      const listingObj = listing.toObject();
      listingObj.amenities = Object.fromEntries(
        Object.entries(listingObj.amenities || {}).filter(([key, value]) => value)
      );
      return listingObj;
    });
    res.status(200).json(successfulListings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch successful listings", error });
  }
}

export const toggleSoldStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.isPublished) {
      return res.status(400).json({ message: "Listing must be unpublished before changing sold status" });
    }

    // Toggle between "sold" and original status
    listing.status = listing.status === "sold" ? "buy" : "sold";
    await listing.save();

    res.status(200).json({ message: `Listing status updated to ${listing.status}`, listing });
  } catch (error) {
    res.status(500).json({ message: "Failed to update listing status", error });
  }
};
export const getListingsByAgent = async (req, res) => {
  try {
    const { agentId } = req.params;

    if (!agentId) {
      return res.status(400).json({ message: "Agent ID is required" });
    }

    const listings = await Listing.find({ 
      agent: agentId, 
      isPublished: true 
    }).lean().sort({createdAt: -1})

    // Fetch developer information for all listings
    const listingsWithDeveloperInfo = await Promise.all(
      listings.map(async (listing) => {
        const developerInfo = await Developer.findOne(
          { name: listing.developer },
          'name logoUrl slug'
        ).lean();

        const filteredAmenities = Object.entries(listing.amenities || {})
          .filter(([_, value]) => value === true)
          .reduce((acc, [key]) => {
            acc[key] = true;
            return acc;
          }, {});

        return {
          ...listing,
          developerLogo: developerInfo?.logoUrl || null,
          amenities: filteredAmenities
        };
      })
    );

    res.status(200).json(listingsWithDeveloperInfo);
  } catch (error) {
    console.error("Error fetching listings by agent:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Fetch similar listings based on category, status, and type
export const getSimilarListings = async (req, res) => {
  try {
    const { category, status, type, currentListingId, limit } = req.query;
    const limitNumber = parseInt(limit) || 10; // Default to 10 if limit isn't provided

    // Ensure category, status, and type are provided
    if (!category || !status || !type) {
      return res.status(400).json({
        success: false,
        message: "Category, status, and type are required.",
      });
    }

    // Find listings that match the criteria, excluding the current listing, and limit the results
    let listings = await Listing.find({
      category,
      status,
      type,
      isPublished: true, // Only return published listings
      _id: { $ne: currentListingId },
    })
      .limit(limitNumber)
	.sort({createdAt: -1})
      .populate({ path: "agent", select: "name imageUrls slug" });

    // If no listings are found, send 404
    if (listings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No similar listings found.",
      });
    }

    // Convert each listing to a plain object and filter amenities
    listings = listings.map((listing) => {
      const listingObj = listing.toObject();
      listingObj.amenities = Object.fromEntries(
        Object.entries(listingObj.amenities || {}).filter(([key, value]) => value)
      );
      return listingObj;
    });

    // Return the array of listing objects directly
    res.status(200).json(listings);
  } catch (error) {
    console.error("Error fetching similar listings:", error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};


export const getListingsByDeveloper = async (req, res) => {
  const { developer, projectId, listingId } = req.params;

  try {
    // Fetch listings by the developer, excluding the ones already assigned to the current project
    let listings = await Listing.find({
      developer,
      project: { $ne: projectId }, // Exclude listings that belong to the current project
    }).populate('community project').populate({
        path: "agent", // Include the agent information
        select: "name title imageUrls slug", // Select the agent fields you want to include
      })

    if (!listings.length) {
      return res
        .status(404)
        .json({ success: false, message: "No related listings found for this developer" });
    }
 listings = listings.map(listing => {
      const listingObj = listing.toObject();
      listingObj.amenities = Object.fromEntries(
        Object.entries(listingObj.amenities || {}).filter(([key, value]) => value)
      );
      return listingObj;
    });
    res.status(200).json({ success: true, listings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
 }
};

export const filterListings = async (req, res) => {
  try {
    const { agent,permitNumber, dateCreated } = req.query;

    // Start building the aggregation pipeline
    const filterPipeline = [
      {
        $lookup: {
          from: "agents", // Ensure this matches your agents collection name
          localField: "agent",
          foreignField: "_id",
          as: "agentDetails",
        },
      },
      { $unwind: "$agentDetails" }, // Flatten the array created by $lookup
    ];

    // Add conditions to the pipeline based on query parameters
    if (agent) {
      filterPipeline.push({
        $match: { "agentDetails.name": { $regex: new RegExp(agent, "i") } },
      });
    }
    if (permitNumber) {
      filterPipeline.push({ $match: { permitNumber: Number(permitNumber) } });
    }
    if (dateCreated) {
      const date = new Date(dateCreated); // Convert string date to Date object
      const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Set to start of the day (00:00:00)
      const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // Set to end of the day (23:59:59)

      // Match listings created within the date range
      filterPipeline.push({
        $match: {
          createdAt: {
            $gte: startOfDay, // Greater than or equal to the start of the day
            $lte: endOfDay,   // Less than or equal to the end of the day
          },
        },
      });
    }

    // Execute the aggregation pipeline
    const listings = await Listing.aggregate(filterPipeline);
    res.status(200).json(listings);
  } catch (error) {
    console.error("Error filtering listings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getListingStats = async (req, res, next) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();

    // Basic counts
    const totalListings = await Listing.countDocuments();
    const publishedListings = await Listing.countDocuments({ isPublished: true });
    const unpublishedListings = await Listing.countDocuments({ isPublished: false });

    // Status counts
    const statusCounts = await Listing.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate total revenue from sold properties
    const revenueData = await Listing.aggregate([
      {
        $match: { status: 'sold' }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$regularPrice' }
        }
      }
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Type counts
    const typeCounts = await Listing.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Sold properties by type
    const soldByType = await Listing.aggregate([
      {
        $match: { status: 'sold' }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          revenue: { $sum: '$regularPrice' }
        }
      }
    ]);

    // Category distribution
    const categoryDistribution = await Listing.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Monthly trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrends = await Listing.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          published: {
            $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] }
          },
          sold: {
            $sum: { $cond: [{ $eq: ['$status', 'sold'] }, 1, 0] }
          },
          revenue: {
            $sum: { $cond: [{ $eq: ['$status', 'sold'] }, '$regularPrice', 0] }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Price ranges distribution
    const priceRanges = await Listing.aggregate([
      {
        $bucket: {
          groupBy: '$regularPrice',
          boundaries: [0, 100000, 500000, 1000000, 5000000],
          default: 'Above 5M',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    // Format monthly trends data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedTrends = monthlyTrends.map(trend => ({
      month: months[trend._id.month - 1],
      published: trend.published,
      sold: trend.sold,
      revenue: trend.revenue
    }));

    res.status(200).json({
      success: true,
      data: {
        total: totalListings,
        published: publishedListings,
        unpublished: unpublishedListings,
        users: totalUsers,
        revenue: totalRevenue,
        status: statusCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        type: typeCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        soldByType: soldByType.reduce((acc, curr) => {
          acc[curr._id] = {
            count: curr.count,
            revenue: curr.revenue
          };
          return acc;
        }, {}),
        categories: categoryDistribution.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        monthlyTrends: formattedTrends,
        priceRanges: priceRanges.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    next(error);
  }
};



// Get filtered listings
export const getFilteredListings = async (req, res, next) => {
  try {
    const { category, type, community, project, page = 1, limit = 12 } = req.query;
    
    const query = {
      category,
      type: type === "commercial" ? "commercial" : "residential",
      status: type === "commercial" ? { $in: ["buy", "rent"] } : type,
      isPublished: true
    };

    if (community) {
      query.community = community;
    }

    if (project) {
      query.project = project;
    }

    // Parse pagination parameters
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    const [listings, total] = await Promise.all([
      Listing.find(query)
        .populate("agent", "name imageUrls slug")
        .populate("community", "name")
        .populate("project", "name")
        .populate("developer", "name logoUrl")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Listing.countDocuments(query)
    ]);

    // Format listings data
    const formattedListings = listings.map(listing => ({
      ...listing,
      developerLogo: listing.developer?.logoUrl || null,
      amenities: Object.entries(listing.amenities || {})
        .filter(([_, value]) => value === true)
        .reduce((acc, [key]) => {
          acc[key] = true;
          return acc;
        }, {})
    }));

    res.status(200).json({
      listings: formattedListings,
      pagination: {
        currentPage: parsedPage,
        totalPages: Math.ceil(total / parsedLimit),
        totalItems: total,
        hasNextPage: parsedPage < Math.ceil(total / parsedLimit),
        hasPrevPage: parsedPage > 1
      }
    });
  } catch (error) {
    next(error);
  }
};
