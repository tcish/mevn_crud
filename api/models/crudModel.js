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

crudSchema.path("email").validate(async function (email) {
  const hasMail = await mongoose.models.Crud.countDocuments({ email });
  return !hasMail;
}, "Email already taken!");

const Crud = mongoose.model("Crud", crudSchema);

module.exports = Crud;
