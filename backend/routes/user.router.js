import express from "express";
import {
  signup,
  login,
  logout,
  getUserProfile,
  getUsers,
  updateUserProfile,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

import { checkAuth, checkAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);  // Register new user
router.post("/login", login);    // Login user

// Protected routes (requires login)
router.post("/logout", checkAuth, logout);               // Logout
router.get("/profile", checkAuth, getUserProfile);      // Get own profile
router.put("/profile", checkAuth, updateUserProfile);   // Update own profile

// Admin-only routes
router.get("/", checkAuth, checkAdmin, getUsers);       // Get all users
router.put("/:id", checkAuth, checkAdmin, updateUser);  // Update any user by ID
router.delete("/:id", checkAuth, checkAdmin, deleteUser); // Delete any user by ID

export default router;
