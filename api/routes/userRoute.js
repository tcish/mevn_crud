const express = require("express");
const userController = require("../controllers/userController");
const protectController = require("../controllers/protectController");

const userRoute = express.Router();
userRoute.post("/signup", protectController.loggedIn, userController.signup);
userRoute.post("/signin", protectController.loggedIn, userController.signin);
userRoute.get("/logout", userController.logout);
userRoute.get(
  "/chk-remember",
  protectController.loggedIn,
  userController.CheckRemember
);
userRoute.post(
  "/forgotPassword",
  protectController.loggedIn,
  userController.forgotPassword
);
userRoute.patch(
  "/resetPassword/:token",
  protectController.loggedIn,
  userController.resetPassword
);

module.exports = userRoute;
