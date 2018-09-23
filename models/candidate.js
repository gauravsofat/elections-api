const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const candidateSchema = new Schema(
  {
    comName: String, // Comittee For Which Candidate Is Contesting
    name: String, // Name Of Candidate
    sid: String, // Unique Student ID
    cpi: Number // Cumalative Performance Index
  },
  { collection: "candidates" }
);

// Create A Virtual Attribute Batch From A Substring Of 'sid'
candidateSchema.virtual("batch").get(function() {
  return this.sid.substring(2, 6);
});

module.exports = mongoose.model("Candidate", candidateSchema);
