const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    if (!req.user) {
      const newUser = await User.create({
        phone: req.body.phone,
        passwd: req.body.passwd,
        passwdCheck: req.body.passwdCheck,
      });

      // let token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      //   expiresIn: process.env.JWT_EXPIRED_IN,
      // });
      let token = jwt.sign({ id: newUser._id }, "well-something", {
        expiresIn: "90d",
      });

      res.cookie("jwt", token, {
        expiresIn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      });

      res
        .status(201)
        .json({ status: "success", token, data: { user: newUser } });
    } else {
      res.status(401).json({
        status: "fail",
        message: "You are already logged in!",
      });
    }
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
