const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    if (!req.user) {
      const hasPhone = await User.findOne({ phone: req.body.phone });
      if (hasPhone) {
        return res
          .status(401)
          .json({ status: "fail", message: "Phone number already exist!" });
      }

      const newUser = await User.create({
        phone: req.body.phone,
        passwd: req.body.passwd,
        passwdCheck: req.body.passwdCheck,
      });

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
  const { phone, password, rememberMe } = req.body;

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

  if (rememberMe) {
    let randVal = (Math.random() + 1).toString(36).substring(2);
    res.cookie("remember", randVal, {
      expiresIn: new Date(Date.now() + 604800000),
    });
    await User.findByIdAndUpdate(user._id.toString(), { rememberMe: randVal });
  } else {
    await User.findByIdAndUpdate(user._id.toString(), { rememberMe: null });
    res.clearCookie("remember");
  }

  res.status(200).json({ status: "success", token });
};

exports.logout = async (req, res) => {
  req.user = null;
  res.clearCookie("jwt");

  res.status(200).json({ status: "success" });
};

exports.CheckRemember = async (req, res, next) => {
  const isRemember = req.cookies.remember;
  if (isRemember) {
    const user = await User.findOne({ rememberMe: isRemember });
    const plainPass = await user.correctPassword("12345678", user.passwd);
    // console.log(plainPass);
    if (user.rememberMe) {
      res.status(200).json({ status: "success", data: user });
    }
  }

  next();
};
