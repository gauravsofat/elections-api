const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authLogin = (req, res) => {
  User.findOne({ sid: req.body.sid })
    .exec()
    .then(function(user) {
      if (user === null || user.pwd !== req.body.pwd) {
        console.log("Incorrect Id/Password");
        res.json({ message: "Incorrect Id/Password" });
      } else if (user.hasVoted) {
        console.log("Repeat Attempt: ", user.sid);
        res.json({ message: "User Has Already Voted" });
      } else {
        console.log("Successful Login: ", user.sid);
        const token = jwt.sign(
          {
            sid: user.sid,
            admin: user.sid === process.env.ADMIN_ID
          },
          process.env.LOGIN_SECRET,
          { expiresIn: "1h" }
        );
        res.json({
          message: "Successful Login",
          token,
          admin: user.sid === process.env.ADMIN_ID
        });
      }
    });
};
