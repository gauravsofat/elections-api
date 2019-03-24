const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../../models/user");
const Committee = require("../../models/committee");
const Candidate = require("../../models/candidate");
const Vote = require("../../models/vote");

// Connect To DB
mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true });
mongoose.set("debug", true);
const db = mongoose.connection;
db.on("error", console.log.bind(console, "MongoDB Error:"));
db.once("open", () => {
  console.log("Connected To DB!");
});

Committee.deleteMany().exec();
Vote.deleteMany().exec();
Candidate.deleteMany().exec();

com1 = {
  comName: "com1",
  seats: 1,
  batches: ["1601"],
  candidates: [
    { sid: "201601004", name: "A" },
    { sid: "201601006", name: "B" },
    { sid: "201601003", name: "C" },
    { sid: "201601007", name: "D" }
  ]
};

candidateA = {
  sid: "201601004",
  name: "A",
  comName: "com1",
  batch: "1601",
  cpi: 7.5
};

candidateB = {
  sid: "201601006",
  name: "B",
  comName: "com1",
  batch: "1601",
  cpi: 7.5
};

candidateC = {
  sid: "201601003",
  name: "C",
  comName: "com1",
  batch: "1601",
  cpi: 7.5
};

candidateD = {
  sid: "201601007",
  name: "D",
  comName: "com1",
  batch: "1601",
  cpi: 7.5
};

voteDAB = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601007", "201601004", "201601006"]
};

voteDAC = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601007", "201601004", "201601003"]
};

voteDBC = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601007", "201601006", "201601003"]
};

voteDCA = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601007", "201601003", "201601004"]
};

voteBDA = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601006", "201601007", "201601004"]
};

voteBCD = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601006", "201601003", "201601007"]
};

voteBAC = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601006", "201601004", "201601003"]
};

voteBCA = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601006", "201601003", "201601004"]
};

voteADC = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601004", "201601007", "201601003"]
};

voteADB = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601004", "201601007", "201601006"]
};

voteABD = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601004", "201601006", "201601007"]
};

voteCDA = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601003", "201601007", "201601004"]
};

voteCBD = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601003", "201601006", "201601007"]
};

Committee.create(com1)
  .then(Candidate.create(candidateA))
  .then(Candidate.create(candidateB))
  .then(Candidate.create(candidateC))
  .then(Candidate.create(candidateD))
  // Votes For D
  .then(Vote.create(voteDAB))
  .then(Vote.create(voteDAC))
  .then(Vote.create(voteDBC))
  .then(Vote.create(voteDCA))
  // Votes For B
  .then(Vote.create(voteBDA))
  .then(Vote.create(voteBCD))
  .then(Vote.create(voteBAC))
  .then(Vote.create(voteBCA))
  // Votes For A
  .then(Vote.create(voteADC))
  .then(Vote.create(voteADB))
  .then(Vote.create(voteABD))
  // Votes For C
  .then(Vote.create(voteCDA))
  .then(Vote.create(voteCBD))
  .then(function() {
    db.close();
  });

/* Expected Outcome -
  Iteration 1 -
  D - 4, B - 4, A - 3, C - 2
  Iteration 2 -
  D - 5, B - 5, A - 3
  Iteration 3 -
  D - 7, B -6
  Result: D and B Win.
  */
