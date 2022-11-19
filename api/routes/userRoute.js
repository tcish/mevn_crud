const express = require("express");
const userController = require("../controllers/userController");

const userRoute = express.Router();
userRoute.post("/signup", userController.signup);

module.exports = userRoute