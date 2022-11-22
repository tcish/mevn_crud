const express = require("express");
const crudController = require("../controllers/crudController");
const protectController = require("../controllers/protectController");

const crudRoute = express.Router();

crudRoute.post("/create", protectController.loggedIn, crudController.create);
crudRoute.get("/read", protectController.loggedIn, crudController.read);
crudRoute.get("/read-one/:id", protectController.loggedIn, crudController.readOne);
crudRoute.post("/update-data/:id", protectController.loggedIn, crudController.update);
crudRoute.delete("/delete-data/:id", protectController.loggedIn, crudController.delete);

module.exports = crudRoute;
