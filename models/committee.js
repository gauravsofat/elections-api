const mongoose = require("mongoose");
const { Schema } = mongoose;

const committeeSchema = new Schema(
  {
    comName: String, // Committee Name
    batch: String,
    seats: Number, // Number Of Positions
    candidates: [{ sid: String, name: String }] // Contesting Candidates List
  },
  { collection: "committees" }
);

module.exports = mongoose.model("Committee", committeeSchema);
