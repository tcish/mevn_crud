const express = require("express");
const userController = require("../controllers/userController");
const protectController = require("../controllers/protectController");

const userRoute = express.Router();
userRoute.post("/signup", protectController.notLoggedIn, userController.signup);
userRoute.post("/signin", protectController.notLoggedIn, userController.signin);

module.exports = userRoute