import Project from "../models/project.model.js";
import { errorHandler } from "../utils/error.js";

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
    const project = await Project.findById(req.params.id).populate(
      "community",
      "name"
    );
    if (!project) {
      return next(errorHandler(404, "Project not found!"));
    }
    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().populate("community", "name");
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProject = async (req, res, next) => {
  try {
    const featuredProjects = await Project.find({ featured: true }).populate(
      "community",
      "name"
    );
    res.status(200).json(featuredProjects);
  } catch (error) {
    next(error);
  }
};

export const getProjectByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const projects = await Project.find({ type, featured: true }).populate(
      "community",
      "name"
    );
    console.log(`Fetched ${type} Projects:`, projects); // Debugging line
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching listings by type:", error); // Debugging line
    next(error);
  }
};

export const getProjectByCommunity = async (req, res, next) => {
  try {
    const { community } = req.params;
    console.log(`Fetching projects for community: ${community}`); // Debugging line
    const projects = await Project.find({ community }).populate(
      "community",
      "name"
    );
    console.log(`Fetched Projects:`, projects); // Debugging line
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects by community:", error); // Debugging line
    next(error);
  }
};

export const getProjectByDeveloper = async (req, res, next) => {
  try {
    const { developer } = req.params;
    const projects = await Project.find({ developer }).populate(
      "community",
      "name"
    );
    console.log(`Fetched Projects:`, projects); // Debugging line
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

    const projects = await Project.find(filter).populate("community", "name");
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

    const projects = await Project.find(filter).populate("community", "name");
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

// src/controllers/project.controller.js

// export const searchProjectsByName = async (req, res, next) => {
//   try {
//     const { name } = req.query; // Extract the name from the query parameters
//     const projects = await Project.find({ 
//       name: { $regex: name, $options: "i" } // Case-insensitive search
//     }).populate("community", "name");
    
//     res.status(200).json(projects);
//   } catch (error) {
//     next(error);
//   }
// };


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
