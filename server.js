const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });
const app = require("./app");

mongoose
  .connect(process.env.DATABASE, {
   useNewUrlParser: true,
  })
  .then((con) => {
    console.log("DB Connected");
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
