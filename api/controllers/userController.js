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

exports.signin = async (req, res) => {
  const { phone, password } = req.body;

  // ! 1) check if email and password given
  if (!phone || !password) {
    return res
      .status(400)
      .json({ status: "fail", message: "Please provide email and password!" });
  }

  // ! 2) check if user exists && password is correct
  const user = await User.findOne({ phone });
  if (!user || !(await user.correctPassword(password, user.passwd))) {
    return res
      .status(401)
      .json({ status: "fail", message: "Incorrect email or password" });
  }

  // ! 3) if everything ok, send token to client
  let token = jwt.sign({ id: user._id }, "well-something", {
    expiresIn: "90d",
  });

  res.cookie("jwt", token, {
    expiresIn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  });

  res.status(200).json({ status: "success", token });
};

exports.logout = async (req, res) => {
  res.clearCookie("jwt");

  res.status(200).json({ status: "success" });
};
