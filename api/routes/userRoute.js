const express = require("express");
const userController = require("../controllers/userController");
const protectController = require("../controllers/protectController");

const userRoute = express.Router();
userRoute.post("/signup", protectController.loggedIn, userController.signup);
userRoute.post("/signin", protectController.loggedIn, userController.signin);
userRoute.get("/logout", userController.logout);

module.exports = userRoute