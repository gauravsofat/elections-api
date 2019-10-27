// Import Dependencies
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();

const candidate = require("./routes/candidate");
const committee = require("./routes/committee");
const login = require("./routes/login");
const result = require("./routes/result");
const vote = require("./routes/vote");
const verifyToken = require("./routes/verifyToken");

// Connect To DB
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("debug", true);
const db = mongoose.connection;
db.on("error", console.log.bind(console, "MongoDB Error:"));
db.on("connected", () => {
  console.log("Connected To DB!");
});

const app = express();
app.use(helmet()); // Sanitize Data
app.use(morgan("tiny")); // Custom Request Logging
app.use(express.json()); // JSON Payload Parser

app.use(cors());

app.use("/candidate", candidate);
app.use("/committee", committee);
app.use("/login", login);
app.use("/result", result);
app.use("/vote", vote);
app.use("/verifyToken", verifyToken);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res
    .status(500)
    .json({ message: "Uncaught Internal Server Error, Something Broke." });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server Running On Port: ", port));
