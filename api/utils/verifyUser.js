import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Log the received token
  console.log("Received Token: ", token);

  if (!token) {
    console.log("No token provided");
    return next(errorHandler(401, 'Unauthorized: Token is missing.'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed: ", err);
      const message =
        err.name === 'TokenExpiredError'
          ? 'Unauthorized: Token has expired.'
          : 'Forbidden: Invalid token.';
      return next(errorHandler(403, message));
    }

    // Log the decoded token to ensure it has the correct structure and role
    console.log("Decoded JWT: ", decoded);

    // Validate token payload
    if (!decoded || typeof decoded !== 'object') {
      console.log("Invalid token payload");
      return next(errorHandler(403, 'Forbidden: Invalid token payload.'));
    }

    // Check if the user has a role
    const { role, id } = decoded;
    if (!role) {
      console.log("No user role found in token");
      return next(errorHandler(401, 'Unauthorized: Missing user role.'));
    }

    // Set user information in the request object for further use
    req.user = {
      id,
      role,
    };

    console.log("User authenticated:", req.user);
    next();
  });
};
