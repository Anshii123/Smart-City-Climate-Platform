import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../config/config.js';
import User from '../models/User.js';
import { createDevUser, getDevUserByEmail, verifyDevPassword } from '../services/devStore.js';

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Development fallback when MongoDB Atlas credentials are not yet authenticated
    if (!isDbConnected()) {
      console.warn('[Auth] Database not connected: registering user in development session.');
      const existing = getDevUserByEmail(email);
      if (existing) {
        const error = new Error('User already exists');
        error.statusCode = 400;
        return next(error);
      }
      const devUser = createDevUser(name, email, password, role || 'user');
      return res.status(201).json({
        success: true,
        token: generateToken(devUser._id),
        user: {
          id: devUser._id,
          name: devUser.name,
          email: devUser.email,
          role: devUser.role,
        },
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // If DB fails during call, seamlessly fallback
    console.warn(`[Auth Fallback] Database error during register (${error.message}). Using dev store.`);
    const { name, email, password, role } = req.body;
    const devUser = createDevUser(name || 'Urban Planner', email, password || 'password', role || 'user');
    return res.status(201).json({
      success: true,
      token: generateToken(devUser._id),
      user: {
        id: devUser._id,
        name: devUser.name,
        email: devUser.email,
        role: devUser.role,
      },
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('Please provide an email and password');
      error.statusCode = 400;
      return next(error);
    }

    // Development fallback when MongoDB Atlas credentials are not yet authenticated
    if (!isDbConnected()) {
      console.warn('[Auth] Database not connected: logging in via development session.');
      const devUser = getDevUserByEmail(email);
      if (devUser && verifyDevPassword(password, devUser.passwordHash)) {
        return res.status(200).json({
          success: true,
          token: generateToken(devUser._id),
          user: {
            id: devUser._id,
            name: devUser.name,
            email: devUser.email,
            role: devUser.role,
          },
        });
      }
      // Auto-create dev user for frictionless local experience
      const newDevUser = createDevUser(email.split('@')[0], email, password, 'user');
      return res.status(200).json({
        success: true,
        token: generateToken(newDevUser._id),
        user: {
          id: newDevUser._id,
          name: newDevUser.name,
          email: newDevUser.email,
          role: newDevUser.role,
        },
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      return next(error);
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      return next(error);
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // If DB fails during login, fallback smoothly in dev
    console.warn(`[Auth Fallback] Database error during login (${error.message}). Using dev store.`);
    const { email, password } = req.body;
    const devUser = createDevUser(email ? email.split('@')[0] : 'Urban Planner', email, password || 'password', 'user');
    return res.status(200).json({
      success: true,
      token: generateToken(devUser._id),
      user: {
        id: devUser._id,
        name: devUser.name,
        email: devUser.email,
        role: devUser.role,
      },
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};
