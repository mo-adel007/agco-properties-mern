import Project from "../models/project.model.js";
import Community from "../models/community.model.js";
import Developer from "../models/developer.model.js";
import { errorHandler } from "../utils/error.js";
import he from 'he';
import formatRichText from '../utils/textFormatter.js';
import {convertCamelCaseToWords} from '../utils/stringUtils.js';
//import {formatAmenities} from '../utils/amenityFormatter.js';
//function convertCamelCaseToWords(camelCaseString) {
 // return camelCaseString.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
//}
export const createProject = async (req, res, next) => {
  try {
    const { community: communityId, developer: developerId, ...projectData } = req.body;

    // Check for existing project with same slug in the community
    const existingProject = await Project.findOne({ community: communityId, name:projectData.name });
    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: "A project with the same name already exists in this community."
      });
    }

    // Validate and check community and developer existence
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ success: false, message: "Community not found" });
    }

    const developer = await Developer.findById(developerId);
    if (!developer) {
      return res.status(404).json({ success: false, message: "Developer not found" });
    }

    if (!community.developers.includes(developerId)) {
      return res.status(400).json({
        success: false,
        message: "This developer is not associated with the selected community",
      });
    }

    // Format description if present
    if (projectData.description) {
      projectData.description = formatRichText(projectData.description);
    }

    // Create and populate the new project
    const project = await Project.create({ ...projectData, community: communityId, developer: developerId });
    const populatedProject = await Project.findById(project._id)
      .populate("community", "name")
      .populate("developer", "name logoUrl");

    return res.status(201).json({ success: true, data: populatedProject });
  } catch (error) {
    next(error);
  }
};
export const updateProject = async (req, res, next) => {
  try {
    const { community: newCommunityId, developer: newDeveloperId, ...updateData } = req.body;

    // Find the project to update
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(errorHandler(404, "Project not found!"));
    }

    // If community or developer is being updated, validate their relationship
    if (newCommunityId || newDeveloperId) {
      const communityId = newCommunityId || project.community;
      const developerId = newDeveloperId || project.developer;

      const community = await Community.findById(communityId);
      if (!community) {
        return next(errorHandler(404, "Community not found!"));
      }

      const developer = await Developer.findById(developerId);
      if (!developer) {
        return next(errorHandler(404, "Developer not found!"));
      }

      if (!community.developers.includes(developerId)) {
        return res.status(400).json({
          success: false,
          message: "The new developer is not associated with the selected community.",
        });
      }

      updateData.community = communityId;
      updateData.developer = developerId;
    }

    // Format description using the rich text formatter
    if (updateData.description) {
      updateData.description = formatRichText(updateData.description);
    }

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // Return the updated document
    )
      .populate("community", "name")
      .populate("developer", "name logoUrl");

    return res.status(200).json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};



export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(errorHandler(404, "Project not found!"));
    }

    if (req.user.id !== project.userRef.toString() && req.user.role !== "Super Admin") {
      return next(errorHandler(401, "You are not authorized to delete this project!"));
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Project has been deleted!" });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let project = await Project.findOne({ slug })
	.populate("community", "name")
	.populate('developer','name logoUrl slug description')

    if (!project) {
      return next(errorHandler(404, "Project not found!"));
    }

    let projectObj = project.toObject();
    
    // Get developer logo
    //const developerInfo = await Developer.findOne(
      //{ name: projectObj.developer },
      //'name logoUrl'
    //).lean();

    // Format rich text fields
    if (projectObj.description) {
      projectObj.description = formatRichText(projectObj.description);
    }

let metaTitle = `AGCO PROPERTIES | ${projectObj.community.name} ${projectObj.name}`;
let metaDescritpion = `AGCO PROPERTIES | ${projectObj.description}`;
projectObj.pageTitle = metaTitle;
projectObj.metaDescription = metaDescritpion;

    // Format amenities
    const trueAmenities = Object.entries(projectObj.amenities || {})
      .filter(([_, value]) => value === true)
      .reduce((acc, [key]) => {
        acc[convertCamelCaseToWords(key)] = true;
        return acc;
      }, {});

    const response = {
      ...projectObj,
            developerLogo: projectObj.developer?.logoUrl || null, // Use the populated developer info
      amenities: trueAmenities
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching project:", error);
    next(error);
  }
};


export const getProjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const totalProjects = await Project.countDocuments();
    
    const projects = await Project.find()
      .populate("community", "name")
      .skip(skip)
      .limit(limit);

    const projectsWithFilteredAmenities = projects.map(project => {
      const falseAmenities = Object.keys(project.amenities).reduce((acc, key) => {
        if (project.amenities[key] === true) {
          acc[key] = true;
        }
        return acc;
      }, {});
      return { ...project.toObject(), amenities: falseAmenities };
    });

    res.status(200).json({
      projects: projectsWithFilteredAmenities,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / limit),
      hasMore: skip + projects.length < totalProjects
    });
  } catch (error) {
    next(error);
  }
};


export const getFeaturedProject = async (req, res, next) => {
  try {
    let featuredProjects = await Project.find({ featured: true })
      .populate("community", "name")
      .populate("developer", "name logoUrl")
	.lean()

 const projectsWithInfo = featuredProjects.map(project => ({
      ...project,
      developerLogo: project.developer?.logoUrl || null,
      amenities: Object.entries(project.amenities || {})
        .filter(([_, value]) => value === true)
        .reduce((acc, [key]) => {
          acc[key] = true;
          return acc;
        }, {})
    }));

    res.status(200).json(projectsWithInfo);
  } catch (error) {
    next(error);
  }
};

export const getProjectByType = async (req, res, next) => {
  try {
    const { status, type } = req.params;
    const { limit = 10, offset = 0 } = req.query; // Default to 10 items per request

    let projects = await Project.find({
      status: { $in: ["off plan"] },
      type: "residential"
    })
    .populate("community", "name")
    .populate("developer", "name logoUrl")
    .skip(parseInt(offset))
    .limit(parseInt(limit))
    .lean();

    const projectsWithInfo = projects.map(project => ({
      ...project,
      developerLogo: project.developer?.logoUrl || null,
      amenities: Object.entries(project.amenities || {})
        .filter(([_, value]) => value === true)
        .reduce((acc, [key]) => {
          acc[key] = true;
          return acc;
        }, {})
    }));

    const total = await Project.countDocuments({
      status: { $in: ["off plan"] },
      type: "residential"
    });

    res.status(200).json({ projects: projectsWithInfo, total });
  } catch (error) {
    console.error("Error fetching projects by type:", error);
    next(error);
  }
};


// this one is for the dashboards not for the website only for the developer page
export const getProjectByCommunity = async (req, res, next) => {
  try {
    const { community, developer } = req.params; // Add developer parameter

    // Find projects that match both community and developer
    let projects = await Project.find({ 
      community,
      developer // Add developer filter
    })
    .populate("community", "name")
    .populate("developer", "name logoUrl") // Populate developer info directly
    .limit(15);

    const projectsWithInfo = projects.map(project => {
      const projectObj = project.toObject();

      // Format amenities
      const formattedAmenities = Object.entries(projectObj.amenities || {})
        .filter(([_, value]) => value === true)
        .reduce((acc, [key]) => {
          acc[convertCamelCaseToWords(key)] = true;
          return acc;
        }, {});

      return {
        ...projectObj,
        developerLogo: projectObj.developer?.logoUrl || null, // Use populated developer info
        amenities: formattedAmenities
      };
    });

    res.status(200).json(projectsWithInfo);
  } catch (error) {
    console.error("Error fetching projects by community:", error);
    next(error);
  }
};

// this is for the community page 
export const getProjectsByCommunity = async (req, res, next) => {
  try {
    const { community } = req.params; // Here, 'community' is the community slug

    // Find the community document by its slug
    const communityDoc = await Community.findOne({ slug: community });
    if (!communityDoc) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    // Build the query to fetch projects associated with the community's _id
    const query = { community: communityDoc._id };

    // Find projects matching the query and populate the community and developer fields as needed
    const projects = await Project.find(query)
      .populate("community", "name slug")
      .populate("developer", "name logoUrl")
      .exec();

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching projects by community:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getProjectsBySlug = async (req, res, next) => {
  try {
    const { communitySlug, developerSlug } = req.params;

    const [community, developer] = await Promise.all([
      Community.findOne({
        $or: [{ slug: communitySlug }, { name: communitySlug }]
      }).select('_id'),
      Developer.findOne({
        $or: [{ slug: developerSlug }, { name: developerSlug }]
      }).select('_id')
    ]);

    if (!community || !developer) {
      return res.status(404).json({
        success: false,
        message: 'Community or developer not found'
      });
    }

    const projects = await Project.find({
      community: community._id,
      developer: developer._id
    })
    .populate({
      path: 'community',
      select: 'name slug imageUrls description'
    })
    .populate({
      path: 'developer',
      select: 'name logoUrl slug description'
    })

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No projects found for this community and developer combination'
      });
    }
const projectsWithInfo = projects.map(project => {
      const projectObj = project.toObject();
      const formattedAmenities = projectObj.amenities ?
        Object.entries(projectObj.amenities)
          .filter(([_, value]) => value === true)
          .reduce((acc, [key]) => {
            acc[key] = true;
            return acc;
          }, {})
        : {};

      return {
        ...projectObj,
        developerLogo: projectObj.developer?.logoUrl || null,
	developerDescription: projectObj.developer?.description || null, // Add developer description
        amenities: formattedAmenities
      };
    });

    res.status(200).json({
      success: true,
      data: projectsWithInfo
    });
  } catch (error) {
    console.error("Error fetching projects by slugs:", error);
    next(error);
  }
};
export const getProjectByDeveloper = async (req, res, next) => {
  try {
    const { developer } = req.params;

    // Fetch only the project names for the specified developer
    const projects = await Project.find({ developer })
      .limit(15)
      .select('name'); // Select only the project name

    // Extract project names from the fetched projects
    const projectNames = projects.map(project => project.name);

    // Send the project names in the response
    res.status(200).json(projectNames);
  } catch (error) {
    console.error("Error fetching project names by developer:", error);
    next(error);
  }
};

export const getProjectsByQuery = async (req, res, next) => {
  try {
    const { location, deliveryDate, typeOfUnit, page = 1, limit = 15 } = req.query;
    
    // Parse pagination parameters
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 15;
    const skip = (parsedPage - 1) * parsedLimit;

    let filter = {};

    if (typeOfUnit) filter.typeOfUnit = { $in: typeOfUnit.split(",") };
    if (deliveryDate) {
      const year = parseInt(deliveryDate);
      filter.deliveryDate = {
        $gte: new Date(year, 0, 1),
        $lte: new Date(year, 11, 31),
      };
    }
    if (location) filter.address = { $regex: location, $options: "i" };

    // Get total count for pagination
    const totalProjects = await Project.countDocuments(filter);

    // Fetch projects with pagination
    const projects = await Project.find(filter)
      .populate("community", "name")
      .populate("developer", "name logoUrl")
      .skip(skip)
      .limit(parsedLimit)
      .lean();

    const projectsWithInfo = projects.map(project => ({
      ...project,
      developerLogo: project.developer?.logoUrl || null,
      amenities: Object.entries(project.amenities || {})
        .filter(([_, value]) => value === true)
        .reduce((acc, [key]) => {
          acc[key] = true;
          return acc;
        }, {})
    }));

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalProjects / parsedLimit);
    const hasNextPage = parsedPage < totalPages;
    const hasPrevPage = parsedPage > 1;

    res.status(200).json({
      success: true,
      data: projectsWithInfo,
      pagination: {
        currentPage: parsedPage,
        totalPages,
        totalItems: totalProjects,
        itemsPerPage: parsedLimit,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    next(error);
  }
};


export const getProjectByAdvancedSearch = async (req, res, next) => {
try {
const { location, typeOfUnit, deliveryDate, status } = req.query;
console.log("Received query params:", req.query);


let filter = {};

if (typeOfUnit) filter.typeOfUnit = { $in: typeOfUnit.split(",") };
if (deliveryDate) {
  const year = parseInt(deliveryDate);
  filter.deliveryDate = {
    $gte: new Date(year, 0, 1),
    $lte: new Date(year, 11, 31),
  };
}
if (location) filter.address = { $regex: location, $options: "i" };
if (status) filter.status = { $in: status.split(",") };

let projects = await Project.find(filter)
  .populate("community", "name")
    .populate("developer","name logoUrl")
    .lean()
const projectsWithInfo = projects.map(project => ({
...project,
developerLogo: project.developer?.logoUrl || null,
amenities: Object.entries(project.amenities || {})
.filter(([_, value]) => value === true)
.reduce((acc, [key]) => {
acc[key] = true;
return acc;
}, {})
}));


res.status(200).json(projectsWithInfo);
} catch (error) {
next(error);
}
};

export const searchProjectsByAltText = async (req, res) => {
  try {
    const { altText } = req.query;
    const projects = await Project.find({
      altText: { $regex: altText, $options: "i" },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error searching projects", error });
  }
};

export const getRelatedProjects = async (req, res, next) => {
  try {
    const { developer,currentProjectId } = req.params;

    // First, find the developer document by name
    const developerDoc = await Developer.findOne({ name: developer });
    
    if (!developerDoc) {
      return res.status(404).json({ 
        success: false, 
        message: "Developer not found" 
      });
    }

    // Find projects that match the developer ID and type
    const relatedProjects = await Project.find({
      developer: developerDoc._id, // Use the developer's ObjectId
      _id: { $ne: currentProjectId }, // Exclude current project
    })
    .populate("community", "name")
    .populate("developer", "name logoUrl")
    .lean()
    .limit(15);

    if (!relatedProjects || relatedProjects.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No related projects found" 
      });
    }

    // Format the response data
    const formattedProjects = relatedProjects.map(project => ({
      ...project,
      developerLogo: project.developer?.logoUrl || null,
      amenities: Object.entries(project.amenities || {})
        .filter(([_, value]) => value === true)
        .reduce((acc, [key]) => {
          acc[key] = true;
          return acc;
        }, {})
    }));

    res.status(200).json({ 
      success: true, 
      projects: formattedProjects 
    });

  } catch (error) {
    console.error("Error fetching related projects:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

export const getPriceIndicatorData = async (req, res) => {
  try {
    const { developer, communities } = req.query;

    if (!developer || !communities) {
      return res.status(400).json({
        success: false,
        message: 'Developer and communities are required'
      });
    }

    // Find developer by slug or name
    const developerDoc = await Developer.findOne({ 
      $or: [
        { slug: developer },
        { name: developer }
      ]
    }).select('_id');

    if (!developerDoc) {
      return res.status(404).json({
        success: false,
        message: 'Developer not found'
      });
    }

    // Convert communities string to array if needed
    const communityNames = Array.isArray(communities)
      ? communities
      : communities.split(',');

    // Find communities by slug or name
    const communityDocs = await Community.find({
      $or: [
        { slug: { $in: communityNames } },
        { name: { $in: communityNames } }
      ]
    }).select('_id');

    if (communityDocs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No communities found'
      });
    }

    const communityIds = communityDocs.map(doc => doc._id);

    const projects = await Project.find({
      developer: developerDoc._id,
      community: { $in: communityIds }
    })
    .select('name startingPrice latitude longitude imageUrls slug')
    .lean();

    const mappedProjects = projects.map(project => ({
      name: project.name,
      slug: project.slug,
      startingPrice: project.startingPrice,
      coordinates: {
        latitude: project.latitude,
        longitude: project.longitude
      },
      coverImage: project.imageUrls[0]
    }));

    res.status(200).json({
      success: true,
      data: mappedProjects
    });
  } catch (error) {
    console.error('Price indicator error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching price indicator data',
      error: error.message
    });
  }
};

// Project search controller
export const searchProjects = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Create a case-insensitive regex pattern that matches words in any order
    const searchTerms = query.split(' ').filter(term => term.length > 0);
    const regexPatterns = searchTerms.map(term => `(?=.*${term})`).join('');
    const searchRegex = new RegExp(`^${regexPatterns}.*$`, 'i');

    const projects = await Project.find({
      $or: [
        { name: searchRegex },
        { name: { $regex: `^${searchTerms[0]}`, $options: 'i' } } // Match projects starting with first word
      ]
    })
    .populate([
      { path: 'developer', select: 'name' },
      { path: 'community', select: 'name' }
    ])
    .sort({ name: 1 })
    .limit(20);

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error searching projects:', error);
    res.status(500).json({ message: 'Failed to search projects' });
  }
};
