const User = require("../models/userModel.js");
const util = require("util");
const jwt = require("jsonwebtoken");

exports.notLoggedIn = async (req, res, next) => {
  let token;
  // ^ 1) getting token and check of it's there
  token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "You are not logged in! Please log in to continue",
    });
  }

  // ^ 2) verification of token
  const decoded = jwt.verify(token, "well-something");

  // ^ 3) check if user still exits
  const loggedInUser = await User.findById(decoded.id);
  if (!loggedInUser) {
    req.user = null;
    res.clearCookie("jwt");
    return res.status(401).json({
      status: "fail",
      message: "This user does no longer exits!",
    });
  }

  // ^ getting loggedIn user data here
  req.user = loggedInUser;

  // ^ grant access to protected route
  next();
};

exports.loggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    return res
      .status(401)
      .json({ status: "fail", message: "You are already logged in!" });
  }

  next();
};
