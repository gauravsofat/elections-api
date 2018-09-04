const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Vote = require("../models/vote");

exports.canUserVote = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    console.log("Token Not Provided");
    res.json({ message: "Token Not Provided." });
  } else {
    jwt.verify(token, process.env.LOGIN_SECRET, (err, decodedUser) => {
      if (err) {
        console.log(err);
        res.json({ message: "Error While Decoding Token." });
      } else {
        User.findOne({ sid: decodedUser.sid })
          .exec()
          .then(function(user) {
            if (user === null) {
              res.json({
                message: "User Corresponding To Token Does Not Exist"
              });
            } else if (user.hasVoted) {
              res.json({ message: "User Has Already Voted" });
            } else next();
          })
          .catch(function(err) {
            console.log(err);
            res.json({ message: "Error Querying Decoded User Info." });
          });
      }
    });
  }
};

exports.submitVote = (req, res) => {
  const promises = [];
  for (const vote of req.body.voteList) {
    promises.push(
      Vote.create({
        sid: req.body.sid,
        batch: vote.batch,
        comName: vote.comName,
        prefs: vote.prefs
      }).catch(function(err) {
        console.log("Vote Submission Failed.");
        res.json({ message: "Failed To Submit Vote." });
      })
    );
  }
  Promise.all(promises).then(function() {
    User.updateOne({ sid: req.body.sid }, { hasVoted: true })
      .then(function() {
        console.log("Voting Complete", req.body.sid);
        res.json({ message: "Vote Successfully Submitted" });
      })
      .catch(function(err) {
        console.log("Failed To Update hasVoted Flag");
        res.json({ message: "Failed To Complete Vote Submission" });
      });
  });
};
