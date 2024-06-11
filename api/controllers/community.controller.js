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
      return next(errorHandler(404, 'Community not found!'));
    }

    const updatedCommunity = await Community.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedCommunity);
  } catch (error) {
    next(error);
  }
};

export const deleteCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return next(errorHandler(404, 'Community not found!'));
    }

    await Community.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Community has been deleted!' });
  } catch (error) {
    next(error);
  }
};

export const getCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return next(errorHandler(404, 'Community not found!'));
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
