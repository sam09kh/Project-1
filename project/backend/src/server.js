const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

// database connection required
const connection = require("./models/conn");
connection();

app.use(cors());

dotenv.config();

app.use(bodyparser.json());

// for an user
app.use("/api/auth", require("./routes/userauthenticate"));
app.use("/api/auth", require("./routes/manager"));
app.use("/api/auth", require("./routes/managerrequest"));

app.listen(process.env.PORT, () => {
  console.log(`Server Listenning at port ${process.env.PORT}`);
});
