const express = require("express");
const crudController = require("../controllers/crudController");

const crudRoute = express.Router();
crudRoute.post("/create", crudController.create);
crudRoute.get("/read", crudController.read);
crudRoute.post("/update-data/:id", crudController.update);
crudRoute.delete("/delete-data/:id", crudController.delete);

module.exports = crudRoute