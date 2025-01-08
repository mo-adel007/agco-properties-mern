import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";
import Project from "../models/project.model.js";
import Agent from "../models/agents.model.js";
import Community from '../models/community.model.js'
import Developer from '../models/developer.model.js'
import formatRichText from '../utils/textFormatter.js'
import {buildPropertyQuery} from '../utils/queryBuilder.js';
import he from 'he'
import { getCategoriesByType, getCategoryCount, sortCategoriesByCount } from '../utils/categoryHelpers.js';
function convertCamelCaseToWords(camelCaseString) {
  return camelCaseString.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
}

export const createListing = async (req, res, next) => {
  try {
    const { project, community, agent,name } = req.body;
    const slug = name.toLowerCase()
    .replace(/\|/g, '-') // Replace pipe characters with hyphens
    .replace(/[^\w\s-]/g, '') // Remove other special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim(); 
    // Validate ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(project) ||
      !mongoose.Types.ObjectId.isValid(community) ||
      !mongoose.Types.ObjectId.isValid(agent)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid project, community,developer or agent ID" });
    }

    // Optionally, you can check if the project, community, and agent exist in their respective collections before proceeding.
    const [projectExists, communityExists, agentExists] = await Promise.all([
      Project.findById(project),
      Community.findById(community),
      Agent.findById(agent),
    ]);

    if (!projectExists || !communityExists || !agentExists) {
      return res
        .status(404)
        .json({ message: "Project, community,developer or agent not found" });
    }

    // Create new listing
    const listing = new Listing({
      ...req.body,
	slug,
    });

    await listing.save();

    return res.status(201).json({
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    console.error("Error creating listing:", error);
    next(errorHandler(500, "An error occurred while creating the listing."));
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

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
    if (req.user.id === listing.userRef.toString() || req.user.role === "Super Admin") {
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
    if (req.user.id === listing.userRef.toString() || req.user.role === "Super Admin") {
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
      .limit(15);

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
export const getListingsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    let listings = await Listing.find({ status, type: "residential", isPublished: true })
      .populate("project", "name")
      .populate("community", "name")
      .populate({
        path: "agent",
        select: "name title imageUrls slug",
      })
	.populate({path:"developer",select:"name logoUrl"})
      .lean()
      .limit(15);

 const listingsWithFormattedData = listings.map(listing => {
      const filteredAmenities = Object.entries(listing.amenities || {})
        .filter(([_, value]) => value === true)
        .reduce((acc, [key]) => {
          acc[key] = true;
          return acc;
        }, {});

      return {
        ...listing,
        developerLogo: listing.developer?.logoUrl || null,
        amenities: filteredAmenities
      };
    });

    // Get residential categories
   
    res.status(200).json({
      listings: listingsWithFormattedData,
    });
  } catch (error) {
    next(error);
  }
};

export const getListingsByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    let listings = await Listing.find({
      type,
      status: "rent",
      isPublished: true
    })
      .populate("project", "name")
      .populate("community", "name")
      .populate({
        path: "agent",
        select: "name title imageUrls slug",
      })
      .populate({path:"developer",
       select:"name logoUrl"})
      .lean()
      .limit(15);

    // Fetch developer information for all listings
     const listingsWithFormattedData = listings.map(listing => {
      const filteredAmenities = Object.entries(listing.amenities || {})
        .filter(([_, value]) => value === true)
        .reduce((acc, [key]) => {
          acc[key] = true;
          return acc;
        }, {});

      return {
        ...listing,
        developerLogo: listing.developer?.logoUrl || null,
        amenities: filteredAmenities
      };
    });

    
    res.status(200).json({
      listings:listingsWithFormattedData,
    });
  } catch (error) {
    console.error("Error fetching listings by type:", error);
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
      }).limit(15);
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
      }).limit(15);
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
    }).limit(15);
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
      }).limit(15);
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
      .lean()
      .limit(15);

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
    const { type, status, category, isPublished } = req.query;
    console.log("Received query params:", req.query);
    
    // Base query
    let query = { 
      isPublished: true,
      status: { $ne: "sold" }
    };

    // Add type filter if provided
    if (type) {
      if (!["commercial", "residential"].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid property type. Must be either 'commercial' or 'residential'"
        });
      }
      query.type = type;
    }

    // Add status filter if provided
    if (status) {
      if (!["buy", "rent"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Must be either 'buy' or 'rent'"
        });
      }
      query.status = status;
    }

    // Add category filter if provided
    if (category) {
      query.category = category;
    }

    console.log("Final query:", query);

    const listings = await Listing.find(query)
      .populate({ 
        path: "project", 
        select: "name latitude longitude" 
      })
      .populate("community", "name")
      .populate({
        path: "agent",
        select: "name title imageUrls slug",
      })
      .populate({ 
        path: "developer", 
        select: "name logoUrl slug" 
      })
      .lean()
      .limit(15);

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
    }));

    return res.status(200).json({
      success: true,
      count: listingsWithFormattedData.length,
      data: listingsWithFormattedData
    });

  } catch (error) {
    console.error("Server error:", error);
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
    } = req.query;

    console.log("Received query params:", req.query);

    let query = { isPublished: true };

    if (option) {
      if (option.includes("Commercial")) {
        query.type = "commercial";
        query.status = option.includes("Buy") ? "buy" : "rent";
      } else {
        query.type = "residential";
        query.status = option.toLowerCase();
      }
    }

    if (category) query.category = category;
    if (bedrooms) query.bedrooms = bedrooms;
    if (location) query.address = new RegExp(location, "i");

    if (minArea || maxArea) {
      query.size = {};
      if (minArea) query.size.$gte = minArea;
      if (maxArea) query.size.$lte = maxArea;
    }

    if (minPrice || maxPrice) {
      query.regularPrice = {};
      if (minPrice) query.regularPrice.$gte = minPrice;
      if (maxPrice) query.regularPrice.$lte = maxPrice;
    }

    if (parking && parking.toLowerCase() === "true") {
      query.parking = true;
    }
    if (furnished && furnished.toLowerCase() === "true") {
      query.furnished = true;
    }

    console.log("Final query:", query);

    const listings = await Listing.find(query)
      .populate("project", "name")
      .populate("community", "name")
      .populate({
        path: "agent",
        select: "name title imageUrls slug",
      })
	.populate({path:"developer",select:"name logoUrl slug"})
      .lean()
      .limit(15);


       const listingsWithFormattedData = listings.map(listing => ({
      ...listing,
      developerLogo: listing.developer?.logoUrl || null
    }));

    res.status(200).json(listingsWithFormattedData);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error });
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
    let listings = await Listing.find({})
    .populate('userRef', 'username')
      .populate("project", "name")
      .populate("community", "name")
 .populate({
        path: "agent", // Include the agent information
        select: "name title imageUrls slug", // Select the agent fields you want to include
      });
      console.log("Listings from DB:", listings); // Log data to check
 listings = listings.map(listing => {
      let listingObj = listing.toObject();
      listingObj.amenities = Object.fromEntries(
        Object.entries(listingObj.amenities || {}).filter(([key, value]) => value)
      );
      return listingObj;
    });
    res.status(200).json(listings);
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
      }).limit(15);
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
    }).lean().limit(15);

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
    const { category, status, type,currentListingId } = req.query;

    // Ensure category, status, and type are provided
    if (!category || !status || !type) {
      return res.status(400).json({
        success: false,
        message: "Category, status, and type are required.",
      });
    }

    // Find listings that match the criteria
    let listings = await Listing.find({
      category,
      status,
      type,
      isPublished: true, // Optionally include this to only return published listings
      _id: { $ne: currentListingId }, // Exclude the current listing
    }).populate({path:"agent",select:"name imageUrls slug"})
.limit(12);

    // Check if any listings are found
    if (listings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No similar listings found.",
      });
    }
 listings = listings.map(listing => {
      const listingObj = listing.toObject();
      listingObj.amenities = Object.fromEntries(
        Object.entries(listingObj.amenities || {}).filter(([key, value]) => value)
      );
      return listingObj;
    });
    res.status(200).json({
      success: true,
      listings,
    });
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
      }).limit(15);

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
    const { agent, unitNumber, dateCreated } = req.query;

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
    if (unitNumber) {
      filterPipeline.push({ $match: { unitNumber: Number(unitNumber) } });
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

