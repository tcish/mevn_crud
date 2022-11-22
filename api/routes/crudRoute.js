const express = require("express");
const crudController = require("../controllers/crudController");
const protectController = require("../controllers/protectController");

const crudRoute = express.Router();

crudRoute.post("/create", protectController.notLoggedIn, crudController.create);
crudRoute.get("/read", protectController.notLoggedIn, crudController.read);
crudRoute.get("/read-one/:id", protectController.notLoggedIn, crudController.readOne);
crudRoute.post("/update-data/:id", protectController.notLoggedIn, crudController.update);
crudRoute.delete("/delete-data/:id", protectController.notLoggedIn, crudController.delete);

module.exports = crudRoute;
