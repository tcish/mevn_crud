const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, "No phone no found"],
  },

  passwd: {
    type: String,
    required: [true, "No password given"],
    minlength: 8,
  },

  passwdCheck: {
    type: String,
    required: [true, "No confirm password found"],
    validator: {
      // ! this is only works on create and save!
      function(el) {
        return el == this.passwd;
      },
      message: "Password mismatch!",
    },
  },

  rememberMe: String,

  passResetToken: String,

  passResetExpires: Date,
});

// ? this is for hashing password before inserting data after checking the validation
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwd")) return next();
  this.passwd = await bcrypt.hash(this.passwd, 12);
  this.passwdCheck = undefined;

  next();
});

// ? this is to match user given password
userSchema.methods.correctPassword = async function (
  givenPassword,
  savedPassword
) {
  return await bcrypt.compare(givenPassword, savedPassword);
};

// ? this is to match user given password
userSchema.methods.createPassResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passResetExpires = Date.now() + 600000; // + 10 minutes from current time

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
