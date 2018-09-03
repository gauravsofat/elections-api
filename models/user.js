const mongoose = require("mongoose");
const { Schema } = mongoose;

const randPass = () =>
  Math.random()
    .toString(36)
    .substring(2, 12); // Generate random password

const userSchema = new Schema(
  {
    sid: String, // Unique Student ID
    pwd: { type: String, default: randPass }, // Password
    floor: { type: String, default: "NA" }, // String to denote the floor a voter resides on
    hasVoted: { type: Boolean, default: false } // Flag to store if vote is yet to be casted
  },
  { collection: "users" }
);

userSchema.virtual("batch").get(function() {
  return Number(this.sid.toString().substring(2, 6));
});

module.exports = mongoose.model("User", userSchema); // Export model
