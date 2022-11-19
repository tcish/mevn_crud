const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const crudRoute = require("./routes/crudRoute");
const userRoute = require("./routes/userRoute");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

app.use(crudRoute, userRoute);

module.exports = app;
