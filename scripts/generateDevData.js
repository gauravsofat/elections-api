const db = require("../config/database");
const mongoose = require("mongoose");
// Import DB Models
const User = require("../models/user");
const Committee = require("../models/committee");
const Candidate = require("../models/candidate");
const Vote = require("../models/vote");

// Connect To DB
db.on("error", console.log.bind(console, "MongoDB Error:"));
db.on("connected", () => {
  console.log("Connected To DB!");
});

(function() {
  Committee.deleteMany(err => {
    if (err) {
      console.log(err);
      console.log("Database Error. Failed to clear Committees.");
    } else {
      console.log("Successfully Cleared Committees");
      Vote.deleteMany(err => {
        if (err) {
          console.log(err);
          console.log("Database Error. Failed to clear votes.");
        } else {
          console.log("Successfully Cleared Votes");
          Candidate.deleteMany(err => {
            if (err) {
              console.log(err);
              console.log("Database Error. Failed to create Admin account.`");
            } else {
              console.log("Successfully Cleared Candidates");
              User.deleteMany(err => {
                if (err) {
                  console.log(err);
                  console.log("Database Error. Failed to delete users.");
                }
                console.log("Successfully Cleared Users.");
                User.create({
                  sid: 201601001,
                  name: "John Doe",
                  pwd: "johndoe"
                }).then(() => {
                  User.create({
                    sid: 201601000,
                    name: "Admin",
                    pwd: "admin"
                  }).then(() => mongoose.disconnect());
                });
              });
            }
          });
        }
      });
    }
  });
})();
