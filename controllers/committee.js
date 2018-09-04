const jwt = require("jsonwebtoken");
const Committee = require("../models/committee");

exports.isAdmin = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    console.log("Missing Token");
    res.json({ message: "Token Not Provided." });
  } else {
    jwt.verify(token, process.env.LOGIN_SECRET, function(err, decoded) {
      if (err) {
        console.log("Error Decoding Token.");
        res.json({ message: "Error Decoding Token." });
      } else if (decoded.sid !== process.env.ADMIN_ID) {
        console.log("User Does Not Have Admin Rights");
        res.json({ message: "User Does Not Have Admin Rights" });
      } else next();
    });
  }
};

exports.getCommitteeList = (req, res) => {
  Committee.find()
    .exec()
    .then(function(comList) {
      res.json(comList);
    })
    .catch(function(err) {
      console.log(err);
      res.json({ message: "Database Error. Could Not Obtain Committee List" });
    });
};

exports.addNewCommittee = (req, res) => {
  Committee.create({
    comName: req.body.comName,
    batches: req.body.batches,
    seats: req.body.seats
  })
    .then(function() {
      console.log("New Committee Created");
      res.json({ message: "New Committee Successfully Added" });
    })
    .catch(function(err) {
      console.log(err);
      res.json({ message: "Database Error. Failed To Create Committee." });
    });
};
