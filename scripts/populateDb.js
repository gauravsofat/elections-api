// Meant to be run separately, before starting an instance of the election program.
// The input file to this script - populatedb.xlsx

// Import dependencies
const mongoose = require("mongoose");
const async = require("async");
const XLSX = require("xlsx");
require("dotenv").config();

// Import DB Models
const User = require("../models/user");

// Connect To DB
mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true });
mongoose.set("debug", true);
const db = mongoose.connection;
db.on("error", console.log.bind(console, "MongoDB Error:"));
db.on("connected", () => {
  console.log("Connected To DB!");
});

const wb = XLSX.readFile("populateDb.xlsx");
const userData = XLSX.utils.sheet_to_json(wb.Sheets["userData"]);
const hostelData = XLSX.utils.sheet_to_json(wb.Sheets["hostelData"]);
User.deleteMany(err => {
  if (err) {
    console.log(err);
    res.status(500).send("Database Error. Failed to delete users.`");
  }
  User.create(userData, err => {
    if (err) {
      console.log(err);
      res.status(500).send("Database Error. Failed to create users.");
    }
    async.each(
      hostelData,
      (item, cb) => {
        User.findOneAndUpdate(
          { sid: item.sid },
          { floor: item.room.substring(0, 3) },
          err => {
            if (err) {
              console.log(err);
              res.status(500).send("Database Error. Failed to update floors.");
            }
            cb();
          }
        );
      },
      err => {
        if (err) console.log(err);
        console.log("DB Successfully Populated");
        db.close();
      }
    );
  });
});
