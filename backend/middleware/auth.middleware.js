import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "./asyncHandler.middleware.js";
import apiError from "../utils/apiError.js";

const checkAuth = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;
  if (!token) {
    throw new apiError(401, "you must be logged in!");
  }
  try {
    let { userId } = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(userId);
    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (e) {
    throw new apiError(401, "Invalid Token");
  }
});

const checkAdmin = asyncHandler(async (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    throw apiError(403, "You are not authorized to perform this operation");
  }
});


export {checkAuth, checkAdmin}