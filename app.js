const express = require("express");

const crudRoute = require("./routes/crudRoute");

const app = express();

app.use(express.json());

app.use(crudRoute);

module.exports = app;
