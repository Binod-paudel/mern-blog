import User from "../models/user.model.js";
import asyncHandler from "../middleware/asyncHandler.middleware.js";
import createToken from "../utils/token.utils.js";

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

export { signup, login, logout };
