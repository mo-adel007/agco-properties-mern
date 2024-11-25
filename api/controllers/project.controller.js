import Project from "../models/project.model.js";
import Community from "../models/community.model.js";
import { errorHandler } from "../utils/error.js";
import he from 'he';

function convertCamelCaseToWords(camelCaseString) {
  return camelCaseString.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
}

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    return res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(errorHandler(404, "Project not found!"));
    }
    
    // Update the project with new data from the request body
    // if (req.user.id !== project.userRef.toString() && req.user.role !== "Super Admin")
      const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } // Return the updated document
      
      );
 if (req.body.description) {
     req.body.description = he.decode(req.body.description); // Optional
    }    
      if (req.body.altText !== undefined) project.altText = req.body.altText;
      if (req.body.title !== undefined) project.title = req.body.title;

  
      res.status(200).json(updatedProject);
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
    let project = await Project.findOne({ slug }).populate("community", "name");
    
    if (!project) {
      return next(errorHandler(404, "Project not found!"));
    }

    // Filter amenities to keep only the true ones and convert keys to normal text
    const trueAmenities = Object.keys(project.amenities).reduce((acc, key) => {
      if (project.amenities[key] === true) {
        acc[convertCamelCaseToWords(key)] = true;
      }
      return acc;
    }, {});

    // Include the filtered and formatted amenities in the response
    const projectWithFormattedAmenities = {
      ...project.toObject(),
      amenities: trueAmenities,
    };

    res.status(200).json(projectWithFormattedAmenities);
  } catch (error) {
    console.error("Error fetching project:", error);
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().populate("community", "name").limit(15);
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
    let featuredProjects = await Project.find({ featured: true }).populate(
      "community",
	      "name"
    ).limit(15);
 const projectsWithFilteredAmenities = featuredProjects.map(project => {
      const falseAmenities = Object.keys(project.amenities).reduce((acc, key) => {
        if (project.amenities[key] === true) {
          acc[key] = true;
        }
        return acc;
      }, {});
      return { ...project.toObject(), amenities: falseAmenities };
    });
    res.status(200).json(featuredProjects);
  } catch (error) {
    next(error);
  }
};

export const getProjectByType = async (req, res, next) => {
  try {
    const { status,type } = req.params;
    let projects = await Project.find({ status: "off plan",type:"residential" }).populate(
      "community",
      "name"
    ).limit(15);
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
    console.error("Error fetching listings by type:", error); // Debugging line
    next(error);
  }
};

export const getProjectByCommunity = async (req, res, next) => {
  try {
    const { community } = req.params;
    let projects = await Project.find({ community }).populate(
      "community",
      "name"
    ).limit(15);
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
    console.error("Error fetching projects by community:", error); // Debugging line
    next(error);
  }
};

export const getProjectByDeveloper = async (req, res, next) => {
  try {
    const { developer } = req.params;
    let projects = await Project.find({ developer }).populate(
      "community",
      "name"
    ).limit(15);
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
    console.error("Error fetching listings by type:", error); // Debugging line
    next(error);
  }
};

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

    const projects = await Project.find(filter).populate("community", "name").limit(15);
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectByAdvancedSearch = async (req, res, next) => {
  try {
    const { location, typeOfUnit, deliveryDate, status } = req.query;
    console.log("Received query params:", req.query);

    let filter = {}; // Initialize filter object

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

    const projects = await Project.find(filter).populate("community", "name").limit(15);
    res.status(200).json(projects);
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
