import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    // if (req.user.id !== listing.userRef) {
    //   return next(errorHandler(401, 'You can only delete your own listings!'));
    // }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Listing has been deleted!' });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
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
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getPublishedListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ isPublished: true });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getListingsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const listings = await Listing.find({ status, isPublished: true });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
export const getListingsByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const listings = await Listing.find({ type, isPublished: true });
    console.log(`Fetched ${type} Listings:`, listings); // Debugging line
    res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching listings by type:', error); // Debugging line
    next(error);
  }
};

export const getFeaturedListings = async (req, res, next) => {
  try {
    const featuredListings = await Listing.find({ isPublished: true, featured: true });
    res.status(200).json(featuredListings);
  } catch (error) {
    next(error);
  }
};

export const getListingsByDeveloperAndCommunity = async (req, res, next) => {
  try {
    const { developer, community } = req.params;
    const listings = await Listing.find({ developer, community, isPublished: true });
    res.status(200).json(listings);
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