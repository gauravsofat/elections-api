const mongoose = require('mongoose');
const Committee = require('../models/committee');
const Candidate = require('../models/candidate');
const Vote = require('../models/vote');
const User = require('../models/user');
require('dotenv').config();

mongoose.set('debug', true);
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
});
mongoose.clear = async options => {
  if (options.user) {
    await Committee.remove();
    await Candidate.remove();
    await Vote.remove();
    await User.remove();
  } else {
    await Committee.remove();
    await Candidate.remove();
    await Vote.remove();
  }
};

module.exports = mongoose.connection;
