// Import Dependencies
const express = require("express");
const morgan = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();

const login = require("./routes/login");

// Connect To DB
mongoose.connect(
  process.env.DB_HOST,
  { useNewUrlParser: true }
);
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

// Response Headers To Allow CORS
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Credentials", "true");
  res.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.set(
    "Access-Control-Allow-Headers",
    "Origin, Accept, X-Requested-With, Content-Type, x-access-token"
  );
  res.set("Cache-Control", "no-cache");
  next();
});

app.use("/login", login);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res
    .status(500)
    .json({ message: "Uncaught Internal Server Error, Something Broke." });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server Running On Port: ", port));
