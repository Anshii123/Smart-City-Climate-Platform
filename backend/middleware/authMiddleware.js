import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import User from '../models/User.js';
import { getDevUserById } from '../services/devStore.js';

// Protect routes
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const error = new Error('Not authorized to access this route');
    error.statusCode = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    try {
      req.user = await User.findById(decoded.id);
    } catch {
      req.user = null;
    }
    
    // Fallback to dev store if user was created while database was offline
    if (!req.user) {
      req.user = getDevUserById(decoded.id);
    }

    if (!req.user) {
      // Mock minimal user context so user is never abruptly locked out in development
      req.user = {
        _id: decoded.id || 'dev_user',
        name: 'Urban Planner',
        email: 'user@smartcity.gov',
        role: 'user'
      };
    }

    next();
  } catch {
    const error = new Error('Not authorized to access this route');
    error.statusCode = 401;
    return next(error);
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error(
        `User role '${req.user?.role || 'none'}' is not authorized to access this route`
      );
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};
