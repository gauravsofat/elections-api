const mongoose = require("mongoose");
const { Schema } = mongoose;

const committeeSchema = new Schema(
  {
    comName: { type: String, required: true }, // Committee Name
    batches: [String], // Array Of Batches Voting For These Seats
    seats: { type: Number, required: true }, // Number Of Positions
    candidates: [{ sid: String, name: String }] // Contesting Candidates List
  },
  { collection: "committees" }
);

module.exports = mongoose.model("Committee", committeeSchema);
