const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../../models/user");
const Committee = require("../../models/committee");
const Candidate = require("../../models/candidate");
const Vote = require("../../models/vote");

// Connect To DB
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
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
  candidates: [{ sid: "201601004", name: "A" }, { sid: "201601006", name: "B" }]
};

com2 = {
  comName: "com2",
  seats: 1,
  batches: ["1601"],
  candidates: [{ sid: "201601003", name: "C" }, { sid: "201601007", name: "D" }]
};

com3 = {
  comName: "com3",
  seats: 1,
  batches: ["1601"],
  candidates: [{ sid: "201601002", name: "E" }, { sid: "201601008", name: "F" }]
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
  comName: "com2",
  batch: "1601",
  cpi: 7.5
};

candidateD = {
  sid: "201601007",
  name: "D",
  comName: "com2",
  batch: "1601",
  cpi: 7.5
};

candidateE = {
  sid: "201601002",
  name: "E",
  comName: "com3",
  batch: "1601",
  cpi: 7.5
};

candidateF = {
  sid: "201601008",
  name: "F",
  comName: "com3",
  batch: "1601",
  cpi: 7.5
};

voteAB = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601004", "201601006"]
};

voteBA = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601006", "201601004"]
};

voteA = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601004"]
};

voteB = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601006"]
};

voteCD = {
  sid: "201601201",
  batch: "1601",
  comName: "com2",
  prefs: ["201601003", "201601007"]
};

voteDC = {
  sid: "201601201",
  batch: "1601",
  comName: "com2",
  prefs: ["201601007", "201601003"]
};

voteC = {
  sid: "201601201",
  batch: "1601",
  comName: "com2",
  prefs: ["201601003"]
};

voteD = {
  sid: "201601201",
  batch: "1601",
  comName: "com2",
  prefs: ["201601007"]
};

voteEF = {
  sid: "201601201",
  batch: "1601",
  comName: "com3",
  prefs: ["201601002", "201601008"]
};

voteFE = {
  sid: "201601201",
  batch: "1601",
  comName: "com3",
  prefs: ["201601008", "201601002"]
};

voteE = {
  sid: "201601201",
  batch: "1601",
  comName: "com3",
  prefs: ["201601002"]
};

voteF = {
  sid: "201601201",
  batch: "1601",
  comName: "com3",
  prefs: ["201601008"]
};

Committee.create(com1)
  .then(Committee.create(com2))
  .then(Committee.create(com3))
  .then(Candidate.create(candidateA))
  .then(Candidate.create(candidateB))
  .then(Candidate.create(candidateC))
  .then(Candidate.create(candidateD))
  .then(Candidate.create(candidateE))
  .then(Candidate.create(candidateF))
  // A: 4, B: 6, A wins, One Iteration, No Ties
  .then(Vote.create(voteAB))
  .then(Vote.create(voteAB))
  .then(Vote.create(voteA))
  .then(Vote.create(voteA))
  .then(Vote.create(voteBA))
  .then(Vote.create(voteBA))
  .then(Vote.create(voteBA))
  .then(Vote.create(voteBA))
  .then(Vote.create(voteB))
  .then(Vote.create(voteB))
  // C: 3, D: 7, D Wins, One Iteration, No Ties
  .then(Vote.create(voteCD))
  .then(Vote.create(voteC))
  .then(Vote.create(voteC))
  .then(Vote.create(voteDC))
  .then(Vote.create(voteDC))
  .then(Vote.create(voteDC))
  .then(Vote.create(voteDC))
  .then(Vote.create(voteD))
  .then(Vote.create(voteD))
  .then(Vote.create(voteD))
  // E: 2, F: 8, One Iteration, No Ties
  .then(Vote.create(voteEF))
  .then(Vote.create(voteE))
  .then(Vote.create(voteF))
  .then(Vote.create(voteF))
  .then(Vote.create(voteF))
  .then(Vote.create(voteF))
  .then(Vote.create(voteFE))
  .then(Vote.create(voteFE))
  .then(Vote.create(voteFE))
  .then(Vote.create(voteFE))
  .then(function() {
    db.close();
  });
