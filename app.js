const express = require("express");

const crudRouter = require("./routes/crudRoute");

const app = express();

app.use(express.json());

app.use(crudRouter);

module.exports = app;
