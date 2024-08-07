import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";
import Project from "../models/project.model.js";

export const createListing = async (req, res, next) => {
  try {
    const { project, community } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(project) ||
      !mongoose.Types.ObjectId.isValid(community)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid project or community ID" });
    }

    const listing = new Listing(req.body);
    await listing.save();
    return res.status(201).json(listing);
  } catch (error) {
    console.error("Error creating listing:", error);
    next(errorHandler(500, "An error occurred while creating the listing."));
  }
};
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    // if (req.user.id !== listing.userRef) {
    //   return next(errorHandler(401, 'You can only delete your own listings!'));
    // }

    await Listing.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Listing has been deleted!" });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  // if (req.user.id !== listing.userRef) {
  //   return next(errorHandler(401, 'You can only update your own listings!'));
  // }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (req.body.altText !== undefined) listing.altText = req.body.altText;
    if (req.body.title !== undefined) listing.title = req.body.title;
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
export const publishListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (listing.userRef.toString() === req.user.id) {
      listing.isPublished = true;
      await listing.save();
      res.status(200).json({ message: "Listing published" });
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    next(error);
  }
};

export const unpublishListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (listing.userRef.toString() === req.user.id) {
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

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate({
        path: 'project',
        select: 'name latitude longitude',  // Ensure you get the coordinates
      })
      .populate('community', 'name');  // Optionally include community details

    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getPublishedListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ isPublished: true })
      .populate("project", "name")
      .populate("community", "name");

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getListingsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const listings = await Listing.find({ status, isPublished: true })
      .populate("project", "name")
      .populate("community", "name");
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
export const getListingsByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const listings = await Listing.find({ type, isPublished: true })
      .populate("project", "name")
      .populate("community", "name");
    console.log(`Fetched ${type} Listings:`, listings); // Debugging line
    res.status(200).json(listings);
  } catch (error) {
    console.error("Error fetching listings by type:", error); // Debugging line
    next(error);
  }
};

export const getFeaturedListings = async (req, res, next) => {
  try {
    const featuredListings = await Listing.find({
      isPublished: true,
      featured: true,
    })
      .populate("project", "name")
      .populate("community", "name");
    res.status(200).json(featuredListings);
  } catch (error) {
    next(error);
  }
};

export const getListingsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const listings = await Listing.find({ category, isPublished: true });
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
    });
    console.log("Project found:", project); // Debug log

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const listings = await Listing.find({
      project: project._id, // Use project._id to search listings
      isPublished: true,
    }).populate("project", "name");
    console.log("Listings found:", listings); // Debug log

    if (listings.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No listings found for this project",
        });
    }

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
      .populate("community", "name");

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getListingsByQueryParams = async (req, res, next) => {
  try {
    const { option, category, bedrooms, location } = req.query;
    console.log("Received query params:", req.query);
    let query = { isPublished: true };

    if (option) {
      if (option === "Commercial") {
        query.type = "commercial";
      } else if (option === "Buy") {
        query.type = "residential";
        query.status = "buy";
      } else if (option === "Rent") {
        query.type = "residential";
        query.status = "rent";
      }
    }

    if (category) query.category = category;
    if (bedrooms) query.bedrooms = bedrooms;
    if (location) query.address = new RegExp(location, "i");

    console.log("Final query:", query);

    const listings = await Listing.find(query)
      .populate("project", "name")
      .populate("community", "name");

    res.status(200).json(listings);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error });
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
      .populate("community", "name");

    res.status(200).json(listings);
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
      .limit(1);

    if (!lowestPriceListing) {
      return res.status(404).json({ success: false, message: 'No listings found for this project' });
    }

    res.status(200).json({ success: true, startingPrice: lowestPriceListing.regularPrice });
  } catch (error) {
    next(error);
  }
};

// export const searchListingsByName = async (req, res, next) => {
//   try {
//     const { name } = req.query;
//     const listings = await Listing.find({
//       name: { $regex: name, $options: "i" }, // Case-insensitive search
//       isPublished: true, // Optional: filter only published listings
//     });

//     res.status(200).json(listings);
//   } catch (error) {
//     console.error("Error searching listings by name:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// export const searchListingsByAltText = async (req, res) => {
//   try {
//     const { altText } = req.query;
//     const listings = await Listing.find({
//       altText: { $regex: altText, $options: "i" },
//     });
//     res.json(listings);
//   } catch (error) {
//     res.status(500).json({ message: "Error searching listings", error });
//   }
// };
