const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true
});
mongoose.set("debug", true);

module.exports = mongoose.connection;
