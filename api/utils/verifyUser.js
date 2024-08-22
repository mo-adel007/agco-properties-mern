import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Log the received token
  console.log("Received Token: ", token);

  if (!token) {
    console.log("No token provided");
    return next(errorHandler(401, 'Unauthorized'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification failed: ", err);
      return next(errorHandler(403, 'Forbidden'));
    }

    // Log the decoded token to ensure it has the correct structure and role
    console.log("Decoded JWT: ", user);

    // Check if the user has the required role
    if (!user || !user.role) {
      console.log("No user role found in token");
      return next(errorHandler(401, 'Unauthorized'));
    }

    req.user = user;
    next();
  });
};
