const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

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

  // ! check if email and password given
  if (!phone || !password) {
    return res
      .status(400)
      .json({ status: "fail", message: "Please provide email and password!" });
  }

  const user = await User.findOne({ phone });
  // ! check if remember me option is selected or not
  if (!req.cookies.remember) {
    // ! check if user exists && password is correct
    if (!user || !(await user.correctPassword(password, user.passwd))) {
      return res
        .status(401)
        .json({ status: "fail", message: "Incorrect email or password" });
    }
  } else {
    // ! check if remember me auto set password is correct
    if (!(await User.findOne({ passwd: password }))) {
      return res
        .status(401)
        .json({ status: "fail", message: "Incorrect email or password" });
    }
  }

  // ! if everything ok, send token to client
  let token = jwt.sign({ id: user._id }, "well-something", {
    expiresIn: "90d",
  });

  res.cookie("jwt", token, {
    expiresIn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  });

  // ! this is for login remember me functionality
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
    if (user && user.rememberMe == isRemember) {
      res.status(200).json({ status: "success", data: user });
    } else {
      return res
        .status(404)
        .json({ status: "fail", message: "Invalid remember token!" });
    }
  }

  next();
};

exports.forgotPassword = async (req, res, next) => {
  try {
    // ! get user based on given phone number
    const user = await User.findOne({ phone: req.body.phone });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "No user found with given phone number!",
      });
    }

    // ! generate the random token
    let resetToken;
    user.createPassResetToken().then((res) => {
      resetToken = res;
    });
    await user.save({ validateBeforeSave: false });

    // ! send it to user's email
    // const resetUrl = `${req.protocol}://${req.get(
    //   "host"
    // )}/resetPassword/${resetToken}`;

    const resetUrl = `${req.protocol}://127.0.0.1:8080/#/reset-password/${resetToken}`;

    const message = `Forgot your password? Submit a patch request with your new password and password confirm to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: req.body.email,
        subject: "Your password reset token (valid for 10 minutes)",
        message,
      });

      res
        .status(200)
        .json({ status: "success", message: "Token is sent to email" });
    } catch (e) {
      user.passResetToken = undefined;
      user.passResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status("500").json({
        status: "fail",
        message:
          "There was an error while sending the email. Please try again.",
      });
    }
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // ! get user based on the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passResetToken: hashedToken,
      passResetExpires: { $gt: Date.now() },
    });

    // ! if token has not expired, and there is user, set the new password
    if (!user) {
      return res
        .status(400)
        .json({ status: "fail", message: "Token is invalid or has expired!" });
    }

    // ! update changedPasswordAt property for the user
    if (req.body.newPass == req.body.newPassChk) {
      user.passwd = req.body.newPass;
      user.passResetToken = undefined;
      user.passResetExpires = undefined;
      await user.save();
    } else {
      return res
        .status(403)
        .json({ status: "fail", message: "New password do not match!" });
    }

    // ! log the user in, send jwt
    let token = jwt.sign({ id: user._id }, "well-something", {
      expiresIn: "90d",
    });

    res.cookie("jwt", token, {
      expiresIn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });

    res.status(201).json({ status: "success", message: "Password Changed successfully!" });
  } catch (err) {}
};
