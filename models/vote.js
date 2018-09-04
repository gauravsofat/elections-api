const mongoose = require("mongoose");
const { Schema } = mongoose;

const voteSchema = new Schema(
  {
    sid: String, // for testing
    comName: String, // Committee Name
    batch: String,
    prefs: [String] // Vote Preferences
  },
  { collection: "votes" }
);

module.exports = mongoose.model("Vote", voteSchema); // Export model
