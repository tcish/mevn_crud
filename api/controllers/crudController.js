const { populate } = require("../models/crudModel.js");
const Crud = require("../models/crudModel.js");
const Skill = require("../models/skillModel");

exports.create = async (req, res) => {
  try {
    const hasMail = await Crud.findOne({ email: req.body.email });
    if (hasMail) {
      return res
        .status(401)
        .json({ status: "fail", message: "Email already exist!" });
    }

    const crudData = await Crud.create({
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      user: req.user._id,
    });

    req.body.skills.forEach(async (element) => {
      if (element.status != 0) {
        const skillData = await Skill.create({
          skill: element.value,
          index: element.index,
        });

        await Crud.findByIdAndUpdate(crudData._id, {
          $push: { skill: skillData._id },
        });
      }
    });

    res.status(201).json({ status: "success", message: "Data Inserted" });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.read = async (req, res) => {
  try {
    const datas = await Crud.find({ user: req.user._id })
      .populate("skill")
      .sort({ _id: "desc" });

    res.status(200).json({ status: "success", data: { datas } });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.readOne = async (req, res) => {
  try {
    const data = await Crud.findById(req.params.id).populate("skill").exec();
    res.status(200).json({ status: "success", data: { data } });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const hasMail = await Crud.findOne({ email: req.body.email });
    if (hasMail && hasMail._id.toString() != req.params.id) {
      return res
      .status(401)
      .json({ status: "fail", message: "Email already exist!" });
    }
    
    const crudData = await Crud.findByIdAndUpdate(req.params.id, ({
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
    }), {
      new: true,
      runValidators: true,
    });

    if (!crudData) {
      return res.status(401).json({
        status: "fail",
        message: "No data found with that ID",
      });
    }

    req.body.skill.forEach(async (element) => {
      if (!element.status) {
        const skillData = await Skill.findByIdAndUpdate(
          element._id,
          { skill: element.skill },
          {
            new: true,
            runValidators: true,
          }
        );
      } else if (element.status != 0) {
        const skillData = await Skill.create({
          skill: element.skill,
        });

        await Crud.findByIdAndUpdate(req.params.id, {
          $push: { skill: skillData._id },
        });
      }
    });

    res
      .status(200)
      .json({ status: "success", message: "Updated Successfully" });
  } catch (err) {
    console.log(1);
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const data = await Crud.findOneAndDelete({ _id: req.params.id });

    if (!data) {
      return res.status(401).json({
        status: "fail",
        message: "No data found with that ID",
      });
    }

    res.status(200).json({ status: "success", message: "Delete successful" });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
