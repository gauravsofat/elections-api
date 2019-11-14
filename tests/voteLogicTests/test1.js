const db = require("../../config/database");
const Committee = require("../../models/committee");
const Candidate = require("../../models/candidate");
const Vote = require("../../models/vote");

// Connect To DB
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
    { sid: "201601006", name: "A" },
    { sid: "201601004", name: "B" }
  ]
};

candidateA = {
  sid: "201601006",
  name: "A",
  comName: "com1",
  batch: "1601",
  cpi: 7.5
};

candidateB = {
  sid: "201601004",
  name: "B",
  comName: "com1",
  batch: "1601",
  cpi: 7.9
};

voteAB = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601006", "201601004"]
};

voteBA = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601004", "201601006"]
};

voteA = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601006"]
};

voteB = {
  sid: "201601201",
  batch: "1601",
  comName: "com1",
  prefs: ["201601004"]
};

Committee.create(com1)
  .then(Candidate.create(candidateA))
  .then(Candidate.create(candidateB))
  // A: 6, B: 4, A wins, One Iteration, No Ties
  .then(Vote.create(voteAB))
  .then(Vote.create(voteAB))
  .then(Vote.create(voteAB))
  .then(Vote.create(voteAB))
  .then(Vote.create(voteA))
  .then(Vote.create(voteA))
  .then(Vote.create(voteBA))
  .then(Vote.create(voteBA))
  .then(Vote.create(voteB))
  .then(Vote.create(voteB))
  .then(function() {
    db.close();
  });
