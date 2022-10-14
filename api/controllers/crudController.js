const Crud = require("../models/crudModel.js");

exports.create = async (req, res) => {
  try {
    const data = await Crud.create({
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      skill: req.body.skill,
    });

    res.status(201).json({ status: "success", result: { data } });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.read = async (req, res) => {
  try {
    const datas = await Crud.find().sort({ _id: "desc" });

    res.status(200).json({ status: "success", data: { datas } });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await Crud.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!data) {
      return res.status(401).json({
        status: "fail",
        message: "No data found with that ID",
      });
    }

    res.status(200).json({ status: "success", data: { data } });
  } catch (err) {
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
