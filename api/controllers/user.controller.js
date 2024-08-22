import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import Listing from "../models/listing.model.js";
// Assuming your authentication middleware adds user info to req.user
export const updateUser = async (req, res, next) => {
  try {
    // Allow updates if the user is updating their own account or if the user is a Super Admin
    if (req.user.id !== req.params.id && req.user.role !== 'Super Admin') {
      return next(errorHandler(401, "You can only update your own account or have administrator privileges!"));
    }

    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};



export const getUserListings = async (req, res, next) => {
  try {
    // Allow listings if the user is viewing their own or if the user is a Super Admin
    if (req.user.id === req.params.id || req.user.role === 'Super Admin') {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } else {
      return next(errorHandler(401, "You can only view your own listings or have administrator privileges!"));
    }
  } catch (error) {
    next(error);
  }
};


export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return next(errorHandler(404, "User not found"));
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const countUsers = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({ userCount });
  } catch (error) {
    next(error);
  }
};

// Count users by role
export const countRoles = async (req, res, next) => {
  try {
    const roles = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    const roleCounts = roles.reduce((acc, role) => {
      acc[role._id] = role.count;
      return acc;
    }, {});

    res.status(200).json(roleCounts);
  } catch (error) {
    next(error);
  }
};

