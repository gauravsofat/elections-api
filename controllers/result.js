const computeResult = require("./computeResult");
const jwt = require("jsonwebtoken");

const Committee = require("../models/committee");
const User = require("../models/user");

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

exports.evaluateResult = (req, res) => {
  Committee.find()
    .exec()
    .then(async function(comList) {
      console.log("\n");
      console.log("*".repeat(45));
      console.log("*".repeat(45));
      console.log("Results");
      console.log("\n");

      const allResults = await computeResult(comList);

      console.log("*".repeat(45));
      console.log("*".repeat(45));
      console.log("Results Successfully Evaluated");

      res.json({ message: "Result Successfully Evaluated.", allResults });
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send("Database Error. Failed To Evaluate Result.");
    });
};

exports.getStats = (req, res) => {
  User.countDocuments((err, totalCnt) => {
    if (err) {
      console.log(err);
      res.status(500).send("Failed to get voting stats.");
    }
    User.countDocuments({ hasVoted: true }, (err, votedCnt) => {
      if (err) {
        console.log(err);
        res.status(500).send("Failed to get voting stats.");
      }
      console.log(totalCnt);
      res.json({
        message: "Voting stats obtained.",
        totalCnt,
        votedCnt
      });
    });
  });
};
