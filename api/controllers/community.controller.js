// src/controllers/community.controller.js
import Community from "../models/community.model.js";
import { errorHandler } from "../utils/error.js";

export const createCommunity = async (req, res, next) => {
  try {
    const community = await Community.create(req.body);
    return res.status(201).json(community);
  } catch (error) {
    next(error);
  }
};
export const updateCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return next(errorHandler(404, "Community not found!"));
    }

    // Update metadata fields if they are present in the request body
    if (req.body.altText) community.altText = req.body.altText;
    if (req.body.title) community.title = req.body.title;
    if (req.body.caption) community.caption = req.body.caption;
    if (req.body.description) community.description = req.body.description;
    if (req.body.imageUrls) community.imageUrls = req.body.imageUrls;
    if (req.body.name) community.name = req.body.name;

    await community.save();
    res.status(200).json(community);
  } catch (error) {
    next(error);
  }
};

// export const updateCommunity = async (req, res, next) => {
//   try {
//     const community = await Community.findById(req.params.id);
//     if (!community) {
//       return next(errorHandler(404, 'Community not found!'));
//     }

//     const updatedCommunity = await Community.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.status(200).json(updatedCommunity);
//   } catch (error) {
//     next(error);
//   }
// };

export const deleteCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return next(errorHandler(404, "Community not found!"));
    }

    await Community.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Community has been deleted!" });
  } catch (error) {
    next(error);
  }
};

export const getCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return next(errorHandler(404, "Community not found!"));
    }
    res.status(200).json(community);
  } catch (error) {
    next(error);
  }
};

export const getCommunities = async (req, res, next) => {
  try {
    const communities = await Community.find();
    res.status(200).json(communities);
  } catch (error) {
    next(error);
  }
};

export const getFeaturedCommunity = async (req, res, next) => {
  try {
    const featuredCommunities = await Community.find({ featured: true });
    res.status(200).json(featuredCommunities);
  } catch (error) {
    next(error);
  }
};

export const getCommunitiesByDeveloper = async (req, res, next) => {
  try {
    const { developer } = req.params;
    console.log(`Fetching communities for developer: ${developer}`); // Log the developer parameter
    const communities = await Community.find({ developer });
    console.log("Communities found:", communities); // Log the retrieved communities
    res.status(200).json(communities);
  } catch (error) {
    console.error("Error fetching communities:", error); // Log the error if any
    next(error);
  }
};

export const searchCommunitiesByAltText = async (req, res) => {
  try {
    const { altText } = req.query; // Assuming the search term is passed as a query parameter
    const communities = await Community.find({
      altText: { $regex: altText, $options: "i" },
    });
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: "Error searching communities", error });
  }
};
