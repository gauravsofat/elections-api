const jwt = require("jsonwebtoken");
const Candidate = require("../models/candidate");
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

exports.addNewCandidate = (req, res) => {
  Candidate.create({
    comName: req.body.comName,
    name: req.body.name,
    sid: req.body.sid,
    cpi: req.body.cpi
  })
    .then(function(candidate) {
      Committee.update(
        { comName: candidate.comName, batches: candidate.batch },
        { $push: { candidates: { sid: candidate.sid, name: candidate.name } } }
      )
        .then(function() {
          console.log("New Candidate Successfully Added.");
          res.json({ message: "New Candidate Successfully Added" });
        })
        .catch(function(err) {
          console.log(err);
          res.json({ message: "Database Error. Failed To Update Committee." });
        });
    })
    .catch(function(err) {
      console.log(err);
      res.json({ message: "Database Error. Failed To Add Candidate." });
    });
};
