import User from "../models/user.model.js";
import asyncHandler from "../middleware/asyncHandler.middleware.js";
import createToken from "../utils/token.utils.js";
import ApiError from "../../../electronic-mern/backend/utils/apiError.js";

//@desc register new user
//@route /api/v/users/register
//@access public
const signup = asyncHandler(async (req, res) => {
  let { email, password } = req.body;
  let userexists = await User.findOne({ email });
  if (userexists) {
    let err = new Error(`User with email ${email} already exists!`);
    err.status = 400;
    throw err;
  }

  let user = await User.create(req.body);
  createToken(res, user._id);
  res.send({
    message: "User registered!",
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

//@desc login
//@route /api/v/users/login
//access public

const login = asyncHandler(async (req, res) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    let err = new Error(`${email} not registered!`);
    err.status = 400;
    throw err;
  }
  if (await user.matchPassword(password)) {
    createToken(res, user._id);
    res.send({
      message: "login successful!",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } else {
    let err = new Error("Invalid Password!");
    err.status = 400;
    throw err;
  }
});

//@desc user logout
//@route /api/v/user/logout
//@access private

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("jwt");
  res.send({ message: "logout successfully!" });
});

//@desc get all users
//@route /api/v/users
//@access private + admin user
const getUsers = asyncHandler(async (req, res) => {
  let users = await User.find({}).select("-password");
  res.send(users);
});

//@desc get user profile
//@route /api/v/users/profile
//@access private

const getUserProfile = asyncHandler(async (req, res) => {
  res.send(req.user);
});

//@desc update User Profile
//@route PUT/api/v/users
//@access private

const updateUserProfile = asyncHandler(async (req, res) => {
  let id = req.user._id;
  let user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not Found");

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) user.password = req.body.password;

  let updatedUser = await user.save();

  res.send({
    message: "User updated!",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    },
  });
});

//@desc update User
//@route PUT/api/v/users/:id
//@access private/admin
const updateUser = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let user = await User.findById(id);

  if (!user) throw new ApiError(404, "User not Found!");

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;

  let updatedUser = await user.save();

  res.send({
    message: "User updated successfully",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    },
  });
});

//@desc delete user
//@route DELETE/api/v/users
//@access private/admin

const deleteUser = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found!");
  if (user.role === "admin") throw new ApiError(400, "Cannot delete a admin");

  await user.deleteOne();
  res.send({ message: "User deleted!" });
});

export {
  signup,
  login,
  logout,
  getUsers,
  getUserProfile,
  updateUserProfile,
  updateUser,
  deleteUser
};
