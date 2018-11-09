const jwt = require("jsonwebtoken");

exports.verify = (req, res) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    console.log("Token Not Provided");
    res.status(500).send("Token Not Provided.");
  } else {
    jwt.verify(token, process.env.LOGIN_SECRET, function(err) {
      if (err) {
        console.log("Failed To Verify Token");
        res.status(500).send("Failed To Verify Token");
      } else {
        console.log("Token Verified");
        res.status(200).send("Token Verified");
      }
    });
  }
};
