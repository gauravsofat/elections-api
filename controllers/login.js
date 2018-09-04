const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authLogin = (req, res) => {
  User.findOne({ sid: req.body.sid })
    .exec()
    .then(function(user) {
      if (user === null || user.pwd !== req.body.pwd) {
        console.log("Incorrect Id/Password");
        res.json({ message: "Incorrect Id/Password" });
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
