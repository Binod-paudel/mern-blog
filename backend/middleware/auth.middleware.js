import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "./asyncHandler.middleware.js";
import apiError from "../utils/apiError.js";

const checkAuth = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token) {
    throw new apiError(401, "You must be logged in!");
  }

  try {
    let { userId } = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(userId);

    if (!user) {
      throw new apiError(401, "User not found!");
    }

    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };
    next();
  } catch (e) {
    throw new apiError(401, "Invalid or expired token");
  }
});

const checkAdmin = asyncHandler(async (req, res, next) => {
  if (req.user?.isAdmin) {
    next();
  } else {
    throw new apiError(
      403,
      "you are not authorized to perform this operation!"
    );
  }
});

export { checkAuth, checkAdmin };
