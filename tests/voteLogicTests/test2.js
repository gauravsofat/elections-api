const db = require('../../config/database');
const Committee = require('../../models/committee');
const Candidate = require('../../models/candidate');
const Vote = require('../../models/vote');

// Connect To DB
db.on('error', console.log.bind(console, 'MongoDB Error:'));
db.once('open', () => {
  console.log('Connected To DB!');
});

Committee.deleteMany().exec();
Vote.deleteMany().exec();
Candidate.deleteMany().exec();

const com1 = {
  comName: 'com1',
  seats: 1,
  batches: ['1601'],
  candidates: [
    { sid: '201601004', name: 'A' },
    { sid: '201601006', name: 'B' },
  ],
};

const com2 = {
  comName: 'com2',
  seats: 1,
  batches: ['1601'],
  candidates: [
    { sid: '201601003', name: 'C' },
    { sid: '201601007', name: 'D' },
  ],
};

const com3 = {
  comName: 'com3',
  seats: 1,
  batches: ['1601'],
  candidates: [
    { sid: '201601002', name: 'E' },
    { sid: '201601008', name: 'F' },
  ],
};

const candidateA = {
  sid: '201601004',
  name: 'A',
  comName: 'com1',
  batch: '1601',
  cpi: 7.5,
};

const candidateB = {
  sid: '201601006',
  name: 'B',
  comName: 'com1',
  batch: '1601',
  cpi: 7.5,
};

const candidateC = {
  sid: '201601003',
  name: 'C',
  comName: 'com2',
  batch: '1601',
  cpi: 7.5,
};

const candidateD = {
  sid: '201601007',
  name: 'D',
  comName: 'com2',
  batch: '1601',
  cpi: 7.5,
};

const candidateE = {
  sid: '201601002',
  name: 'E',
  comName: 'com3',
  batch: '1601',
  cpi: 7.5,
};

const candidateF = {
  sid: '201601008',
  name: 'F',
  comName: 'com3',
  batch: '1601',
  cpi: 7.5,
};

const voteAB = {
  sid: '201601201',
  batch: '1601',
  comName: 'com1',
  prefs: ['201601004', '201601006'],
};

const voteBA = {
  sid: '201601201',
  batch: '1601',
  comName: 'com1',
  prefs: ['201601006', '201601004'],
};

const voteA = {
  sid: '201601201',
  batch: '1601',
  comName: 'com1',
  prefs: ['201601004'],
};

const voteB = {
  sid: '201601201',
  batch: '1601',
  comName: 'com1',
  prefs: ['201601006'],
};

const voteCD = {
  sid: '201601201',
  batch: '1601',
  comName: 'com2',
  prefs: ['201601003', '201601007'],
};

const voteDC = {
  sid: '201601201',
  batch: '1601',
  comName: 'com2',
  prefs: ['201601007', '201601003'],
};

const voteC = {
  sid: '201601201',
  batch: '1601',
  comName: 'com2',
  prefs: ['201601003'],
};

const voteD = {
  sid: '201601201',
  batch: '1601',
  comName: 'com2',
  prefs: ['201601007'],
};

const voteEF = {
  sid: '201601201',
  batch: '1601',
  comName: 'com3',
  prefs: ['201601002', '201601008'],
};

const voteFE = {
  sid: '201601201',
  batch: '1601',
  comName: 'com3',
  prefs: ['201601008', '201601002'],
};

const voteE = {
  sid: '201601201',
  batch: '1601',
  comName: 'com3',
  prefs: ['201601002'],
};

const voteF = {
  sid: '201601201',
  batch: '1601',
  comName: 'com3',
  prefs: ['201601008'],
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
