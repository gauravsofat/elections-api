const jwt = require("jsonwebtoken");
const Candidate = require("../models/candidate");
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

exports.addNewCandidate = (req, res) => {
  Candidate.create({
    comName: req.body.comName,
    name: req.body.name,
    sid: req.body.sid,
    cpi: req.body.cpi
  })
    .then(function(candidate) {
      Committee.updateOne(
        { comName: candidate.comName, batches: candidate.batch },
        { $push: { candidates: { sid: candidate.sid, name: candidate.name } } }
      )
        .then(function() {
          console.log("New Candidate Successfully Added.");
          res.status(200).send("New Candidate Successfully Added");
        })
        .catch(function(err) {
          console.log(err);
          res.status(500).send("Database Error. Failed To Update Committee.");
        });
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send("Database Error. Failed To Add Candidate.");
    });
};

exports.getCandidateList = (req, res) => {
  Candidate.find()
    .exec()
    .then(function(candidateList) {
      res.json(candidateList);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send("Database Error. Could Not Obtain Candidate List");
    });
};
