const mongoose = require("mongoose");
const validator = require("validator");

const crudSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name!"],
  },

  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },

  address: {
    type: String,
    required: [true, "Please provide your address"],
  },

  skill: {
    type: String,
    required: [true, "Please provide your skill"],
  },
});

const Crud = mongoose.model("Crud", crudSchema);

module.exports = Crud;
