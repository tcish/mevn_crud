const express = require("express");
const cors = require("cors");

const crudRoute = require("./routes/crudRoute");

const app = express();

app.use(express.json());
app.use(cors());

app.use(crudRoute);

module.exports = app;
