// src/controllers/community.controller.js
import Community from "../models/community.model.js";
import Developer from "../models/developer.model.js";
import Project from '../models/project.model.js'; // Adjust the import based on your project structure
import { errorHandler } from "../utils/error.js";
import mongoose from 'mongoose';
export const createCommunity = async (req, res, next) => {
  try {
    const { developers, ...otherData } = req.body;
     const community = await Community.create({
      ...otherData,
      developers: developers || [], // Handle developers array
    });
    return res.status(201).json(community);
  } catch (error) {
    next(error);
  }
};
//export const updateCommunity = async (req, res, next) => {
  //try {
   // const community = await Community.findById(req.params.id);
    //if (!community) {
     // return next(errorHandler(404, "Community not found!"));
   // }    
    // Update metadata fields if they are present in the request body
   // if (req.body.altText) community.altText = req.body.altText;
    //if (req.body.title) community.title = req.body.title;
    //if (req.body.caption) community.caption = req.body.caption;
    //if (req.body.description) community.description = req.body.description;
    //if (req.body.imageUrls) community.imageUrls = req.body.imageUrls;
    //if (req.body.name) community.name = req.body.name;
	//if (req.body.address) community.address = req.body.address;
	//if(req.body.summary) community.summary = req.body.summary
	//if (typeof req.body.featured !== "undefined") {
//  community.featured = req.body.featured;
//}
//	if(req.body.developer) community.developer = req.body.developer;
  //  await community.save();
   // res.status(200).json(community);
  //} catch (error) {
   // next(error);
  //}
//};

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
export const updateCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return next(errorHandler(404, "Community not found!"));
    }

    // Update all fields including developers array
    Object.keys(req.body).forEach(key => {
      community[key] = req.body[key];
    });

    await community.save();
    res.status(200).json(community);
  } catch (error) {
    next(error);
  }
};
export const deleteCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return next(errorHandler(404, "Community not found!"));
    }

    if (req.user.id !== community.userRef.toString() && req.user.role !== "Super Admin") {
      return next(errorHandler(401, "You are not authorized to delete this community!"));
    }

    await Community.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Community has been deleted!" });
  } catch (error) {
    next(error);
  }
};

export const getCommunityBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug parameter is required"
      });
    }

    console.log("Slug received:", slug);

    // Find the community document using the slug (ensure slug is a string)
    const community = await Community.findOne({ slug: String(slug) })
      .populate("developers", "name logoUrl description")
      .exec();

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found"
      });
    }

    // Convert Mongoose document to plain object
    const communityObject = community.toObject();

    // Add meta tags using proper template literals
    communityObject.meta = {
      title: `AGCO Properties | ${communityObject.name}`,
      description: `Explore ${communityObject.name} in UAE. ${communityObject.name}, Discover exclusive properties and amenities in this prime location.`
    };

    // Transform imageUrls
    communityObject.images = communityObject.imageUrls.map(url => ({
      url,
      alt: communityObject.altText || `${communityObject.name} community image`
    }));

    res.status(200).json({
      success: true,
      data: communityObject
    });

  } catch (error) {
    console.error("Error fetching community by slug:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
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

export const getCommunitiesByDeveloper = async (req, res) => {
  const { developerId } = req.params;

  try {
    // Validate if the developer exists
    const developer = await Developer.findById(developerId);
    if (!developer) {
      return res.status(404).json({
        success: false,
        message: "Developer not found",
      });
    }

    // Fetch communities with projects associated with the developer
    const communitiesWithProjects = await Project.aggregate([
      { $match: { developer:new mongoose.Types.ObjectId(developerId) } },
      { $group: { _id: "$community", projectCount: { $sum: 1 } } },
    ]);

    const communityIds = communitiesWithProjects.map((item) => item._id);

    // Fetch community details using the filtered community IDs
    const communities = await Community.find({ _id: { $in: communityIds } })
      .populate("developers", "name")
      .lean();

    // Map communities to include project counts
    const communityData = communities.map((community) => {
      const projectInfo = communitiesWithProjects.find((item) => item._id.equals(community._id));
      return {
        ...community,
        projectCount: projectInfo ? projectInfo.projectCount : 0,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Communities fetched successfully",
      data: communityData,
    });
  } catch (error) {
    console.error("Error fetching communities:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch communities",
    });
  }
};
export const getAllCommunitiesByDeveloper = async (req, res, next) => {
  try {
    const { developerId } = req.params; // Developer ID from route
    console.log(`Fetching communities for developer ID: ${developerId}`);

    // Ensure developerId is an ObjectId
    if (!mongoose.Types.ObjectId.isValid(developerId)) {
      return res.status(400).json({ success: false, message: "Invalid developer ID." });
    }

    // Query communities where the provided developer ID is in the developers array
    const communities = await Community.find({ developers: developerId }).select(
      "_id name imageUrls description address featured slug"
    );

    console.log("Filtered Communities:", communities);

    // Respond with the filtered communities
    res.status(200).json({ success: true, data: communities });
  } catch (error) {
    console.error("Error fetching communities assigned to the developer:", error);
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

