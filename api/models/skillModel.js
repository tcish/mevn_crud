const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: [true, "Skill can not be empty!"],
  },
});

const Skill = mongoose.model("Skill", skillSchema);

module.exports = Skill;
