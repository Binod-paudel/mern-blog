import User from "../models/user.model.js";
import asyncHandler from "../middleware/asyncHandler.middleware.js";
import createToken from "../utils/token.utils.js";
import apiError from "../utils/apiError.js";

// @desc    Register new user
// @route   POST /api/v/users/register
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new apiError(400, `User with email ${email} already exists!`);
  }

  // Create user
  const user = await User.create(req.body);

  // Generate JWT
  createToken(res, user._id);

  res.status(201).json({
    message: "User registered!",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin, // ✅ boolean
    },
  });
});

// @desc    Login user
// @route   POST /api/v/users/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new apiError(400, `${email} not registered!`);
  }

  if (await user.matchPassword(password)) {
    createToken(res, user._id);
    res.json({
      message: "Login successful!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin, // ✅ boolean
      },
    });
  } else {
    throw new apiError(400, "Invalid password!");
  }
});

// @desc    Logout user
// @route   POST /api/v/users/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logout successful!" });
});

// @desc    Get all users
// @route   GET /api/v/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

// @desc    Get user profile
// @route   GET /api/v/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc    Update user profile
// @route   PUT /api/v/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const user = await User.findById(id);

  if (!user) throw new apiError(404, "User not found");

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    message: "User updated!",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin, // ✅
    },
  });
});

// @desc    Update user by admin
// @route   PUT /api/v/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) throw new apiError(404, "User not found!");

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  // Admin can update admin status
  if (req.body.isAdmin !== undefined) {
    user.isAdmin = req.body.isAdmin;
  }

  const updatedUser = await user.save();

  res.json({
    message: "User updated successfully",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin, // ✅
    },
  });
});

// @desc    Delete user
// @route   DELETE /api/v/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) throw new apiError(404, "User not found!");

  if (user.isAdmin) {
    throw new apiError(400, "Cannot delete an admin user");
  }

  await user.deleteOne();

  res.json({ message: "User deleted!" });
});

export {
  signup,
  login,
  logout,
  getUsers,
  getUserProfile,
  updateUserProfile,
  updateUser,
  deleteUser,
};
