const jwt = require("jsonwebtoken");
const Committee = require("../models/committee");

exports.isAdmin = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    console.log("Missing Token");
    res.status(500).send("Token Not Provided.");
  } else {
    jwt.verify(token, process.env.LOGIN_SECRET, function(err, decoded) {
      if (err) {
        console.log("Error Decoding Token.");
        res.status(500).send("Error Decoding Token.");
      } else if (decoded.sid !== process.env.ADMIN_ID) {
        console.log("User Does Not Have Admin Rights");
        res.status(500).send("User Does Not Have Admin Rights");
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
      res.status(500).send("Database Error. Could Not Obtain Committee List");
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
      res.status(200).send("New Committee Successfully Added");
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send("Database Error. Failed To Create Committee.");
    });
};
