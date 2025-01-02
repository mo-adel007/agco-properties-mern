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

    // Verify the community exists
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    // Verify the developer exists
    const developer = await Developer.findById(developerId);
    if (!developer) {
      return res.status(404).json({
        success: false,
        message: "Developer not found",
      });
    }

    // Ensure the developer is associated with the community
    if (!community.developers.includes(developerId)) {
      return res.status(400).json({
        success: false,
        message: "This developer is not associated with the selected community",
      });
    }

    // Format description using the rich text formatter
    if (projectData.description) {
      projectData.description = formatRichText(projectData.description);
    }

    // Create the project
    const project = await Project.create({
      ...projectData,
      community: communityId,
      developer: developerId,
    });

    // Populate the response
    const populatedProject = await Project.findById(project._id)
      .populate("community", "name")
      .populate("developer", "name logoUrl");

    return res.status(201).json({
      success: true,
      data: populatedProject,
    });
  } catch (error) {
    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern?.slug) {
      return res.status(400).json({
        success: false,
        message: "A project with the same name already exists in this community.",
      });
    }
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
	.populate('developer','name logoUrl')

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
    const projects = await Project.find().populate("community", "name");
  const projectsWithFilteredAmenities = projects.map(project => {
      const falseAmenities = Object.keys(project.amenities).reduce((acc, key) => {
        if (project.amenities[key] === true) {
          acc[key] = true;
        }
        return acc;
      }, {});
      return { ...project.toObject(), amenities: falseAmenities };
    });
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};


export const getFeaturedProject = async (req, res, next) => {
  try {
    let featuredProjects = await Project.find({ featured: true })
      .populate("community", "name")
      .limit(15);

    const projectsWithInfo = await Promise.all(
      featuredProjects.map(async (project) => {
        const projectObj = project.toObject();
        const developerInfo = await Developer.findOne(
          { name: projectObj.developer },
          'name logoUrl'
        ).lean();

        const formattedAmenities = Object.entries(projectObj.amenities || {})
          .filter(([_, value]) => value === true)
          .reduce((acc, [key]) => {
            acc[convertCamelCaseToWords(key)] = true;
            return acc;
          }, {});

        return {
          ...projectObj,
          developerLogo: developerInfo?.logoUrl || null,
          amenities: formattedAmenities
        };
      })
    );

    res.status(200).json(projectsWithInfo);
  } catch (error) {
    next(error);
  }
};

export const getProjectByType = async (req, res, next) => {
  try {
    const { status, type } = req.params;
    let projects = await Project.find({ 
      status: { $in: ["ready", "off plan"] },
      type: "residential"
    })
    .populate("community", "name")
    .lean()
    .limit(15);

    // Fetch developer information for each project
    const projectsWithDeveloperInfo = await Promise.all(
      projects.map(async (project) => {
        const developerInfo = await Developer.findOne(
          { name: project.developer },
          'name logoUrl'
        ).lean();

            const formattedAmenities = Object.entries(project.amenities || {})
          .filter(([_, value]) => value === true)
          .reduce((acc, [key]) => {
            acc[convertCamelCaseToWords(key)] = true;
            return acc;
          }, {});

        return {
          ...project,
          developerLogo: developerInfo?.logoUrl || null,
          amenities: formattedAmenities
        };
      })
    );

    res.status(200).json(projectsWithDeveloperInfo);
  } catch (error) {
    console.error("Error fetching projects by type:", error);
    next(error);
  }
};
    
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

//export const getProjectByDeveloper = async (req, res, next) => {
 // try {
    //const { developer } = req.params;
    //let projects = await Project.find({ developer })
      //.populate("community", "name")
     // .limit(15);

   // const projectsWithInfo = await Promise.all(
      //projects.map(async (project) => {
       // const projectObj = project.toObject();
      //  const developerInfo = await Developer.findOne(
    //      { name: projectObj.developer },
  //        'name logoUrl'
//        ).lean();

      //  const formattedAmenities = Object.entries(projectObj.amenities || {})
       //   .filter(([_, value]) => value === true)
      //    .reduce((acc, [key]) => {
     //       acc[convertCamelCaseToWords(key)] = true;
    //        return acc;
  //        }, {});

//        return {
          //...projectObj,
          //developerLogo: developerInfo?.logoUrl || null,
        //  amenities: formattedAmenities
      //  };
    //  })
   // );

   // res.status(200).json(projectsWithInfo);
  //} catch (error) {
   // console.error("Error fetching projects by developer:", error);
  //  next(error);
 // }
//};


export const getProjectsByQuery = async (req, res, next) => {
  try {
    const { location, deliveryDate, typeOfUnit } = req.query;
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

    let projects = await Project.find(filter)
      .populate("community", "name")
      .limit(15);

    const projectsWithInfo = await Promise.all(
      projects.map(async (project) => {
        const projectObj = project.toObject();
        const developerInfo = await Developer.findOne(
          { name: projectObj.developer },
          'name logoUrl'
        ).lean();

        const formattedAmenities = Object.entries(projectObj.amenities || {})
          .filter(([_, value]) => value === true)
          .reduce((acc, [key]) => {
            acc[convertCamelCaseToWords(key)] = true;
            return acc;
          }, {});

        return {
          ...projectObj,
          developerLogo: developerInfo?.logoUrl || null,
          amenities: formattedAmenities
        };
      })
    );

    res.status(200).json(projectsWithInfo);
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
      .limit(15);

    const projectsWithInfo = await Promise.all(
      projects.map(async (project) => {
        const projectObj = project.toObject();
        const developerInfo = await Developer.findOne(
          { name: projectObj.developer },
          'name logoUrl'
        ).lean();

        const formattedAmenities = Object.entries(projectObj.amenities || {})
          .filter(([_, value]) => value === true)
          .reduce((acc, [key]) => {
            acc[convertCamelCaseToWords(key)] = true;
            return acc;
          }, {});

        return {
          ...projectObj,
          developerLogo: developerInfo?.logoUrl || null,
          amenities: formattedAmenities
        };
      })
    );

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
export const getRelatedProjects = async (req, res) => {
  try {
    const { developer, type,currentProjectId, status } = req.params;

    // Find projects that match the developer and type (commercial or residential)
    let relatedProjects = await Project.find({
      developer: developer.toUpperCase(), // assuming developer names are stored in uppercase
      type: type, // assuming type is lowercase (commercial, residential)
	_id: { $ne: currentProjectId }, // Exclude current project by ID
	status: "off plan"
    }).limit(15);

  if (!relatedProjects) {
      return next(errorHandler(404, "No related projects found!"));
    }
 const projectsWithFilteredAmenities = relatedProjects.map(project => {
      const falseAmenities = Object.keys(project.amenities).reduce((acc, key) => {
        if (project.amenities[key] === true) {
          acc[key] = true;
        }
        return acc;
      }, {});
      return { ...project.toObject(), amenities: falseAmenities };
    });

    res.status(200).json({ success: true, projects: relatedProjects });
  } catch (error) {
    console.error("Error fetching related projects:", error);
    res.status(500).json({ success: false, message: "Server error" });
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

    // Convert communities string to array if needed
    const communityIds = Array.isArray(communities) 
      ? communities 
      : communities.split(',');

    const projects = await Project.find({
      developer: developer,
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
    res.status(500).json({
      success: false,
      message: 'Error fetching price indicator data',
      error: error.message
    });
  }
};
