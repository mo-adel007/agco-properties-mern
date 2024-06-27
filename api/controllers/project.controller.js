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
      return next(errorHandler(404, 'Project not found!'));
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(errorHandler(404, 'Project not found!'));
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Project has been deleted!' });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('community', 'name');
    if (!project) {
      return next(errorHandler(404, 'Project not found!'));
    }
    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().populate('community', 'name');
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProject = async (req, res, next) => {
  try {
    const featuredProjects = await Project.find({ featured: true }).populate('community', 'name');
    res.status(200).json(featuredProjects);
  } catch (error) {
    next(error);
  }
};

export const getProjectByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const projects = await Project.find({ type, featured: true }).populate('community', 'name');
    console.log(`Fetched ${type} Projects:`, projects); // Debugging line
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching listings by type:', error); // Debugging line
    next(error);
  }
};

export const getProjectByCommunity = async (req, res, next) => {
  try {
    const { community } = req.params;
    console.log(`Fetching projects for community: ${community}`); // Debugging line
    const projects = await Project.find({ community }).populate('community', 'name');
    console.log(`Fetched Projects:`, projects); // Debugging line
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects by community:', error); // Debugging line
    next(error);
  }
};

export const getProjectByDeveloper = async (req, res, next) => {
  try {
    const { developer } = req.params;
    const projects = await Project.find({ developer }).populate('community', 'name');
    console.log(`Fetched Projects:`, projects); // Debugging line
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching listings by type:', error); // Debugging line
    next(error);
  }
};
