const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('debug', true);
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
});

module.exports = mongoose.connection;
