// Meant to be run separately, before starting an instance of the election program.
// The input file to this script - populatedb.xlsx

// Import dependencies
const mongoose = require("mongoose");
const async = require("async");
const XLSX = require("xlsx");
require("dotenv").config();

// Import DB Models
const User = require("../models/user");
const Committee = require("../models/committee");
const Candidate = require("../models/candidate");
const Vote = require("../models/vote");

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

Committee.deleteMany(err => {
  if (err) {
    console.log(err);
    console.log("Database Error. Failed to clear Committees.");
  } else console.log("Successfully Cleared Committees");
});

Vote.deleteMany(err => {
  if (err) {
    console.log(err);
    console.log("Database Error. Failed to clear votes.");
  } else console.log("Successfully Cleared Votes");
});

Candidate.deleteMany(err => {
  if (err) {
    console.log(err);
    console.log("Database Error. Failed to create Admin account.`");
  } else console.log("Successfully Cleared Candidates");
});

User.deleteMany(err => {
  if (err) {
    console.log(err);
    console.log("Database Error. Failed to delete users.");
  }
  console.log("Successfully Cleared Users.");
  User.create(userData, err => {
    if (err) {
      console.log(err);
      console.log("Database Error. Failed to create users.");
    }
    console.log("Successfully added Users.");
    async.each(
      hostelData,
      (item, cb) => {
        User.findOneAndUpdate(
          { sid: item.sid },
          { floor: item.room.substring(0, 3) },
          err => {
            if (err) {
              console.log(err);
              console.log("Database Error. Failed to update floors.");
            }
            cb();
          }
        );
      },
      err => {
        if (err) console.log(err);
        console.log("Users Successfully Populated");
        User.create(
          { sid: process.env.ADMIN_ID, pwd: process.env.ADMIN_PASS },
          err => {
            if (err) {
              console.log(err);
              console.log("Database Error. Failed to create Admin account.`");
            } else {
              console.log("Successfully Created Admin Account");
              db.close();
            }
          }
        );
      }
    );
  });
});
