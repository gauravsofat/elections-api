const Committee = require('../../models/committee');
const Candidate = require('../../models/candidate');
const Vote = require('../../models/vote');
const db = require('../../config/database');

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
  seats: 2,
  batches: ['1601'],
  candidates: [
    { sid: '201601001', name: 'A' },
    { sid: '201601002', name: 'B' },
    { sid: '201601003', name: 'C' },
  ],
};

const candidateA = {
  sid: '201601001',
  name: 'A',
  comName: 'com1',
  batch: '1601',
  cpi: 7.5,
};

const candidateB = {
  sid: '201601002',
  name: 'B',
  comName: 'com1',
  batch: '1601',
  cpi: 7.5,
};

const candidateC = {
  sid: '201601003',
  name: 'B',
  comName: 'com1',
  batch: '1601',
  cpi: 7.5,
};

const voteA = {
  sid: '201601201',
  batch: '1601',
  comName: 'com1',
  prefs: ['201601001'],
};

const voteB = {
  sid: '201601201',
  batch: '1601',
  comName: 'com1',
  prefs: ['201601002'],
};

const voteAB = {
  sid: '201601201',
  batch: '1601',
  comName: 'com1',
  prefs: ['201601001', '201601002'],
};

const voteCA = {
  sid: '201601201',
  batch: '1601',
  comName: 'com1',
  prefs: ['201601003', '201601001'],
};

const voteBC = {
  sid: '201601201',
  batch: '1601',
  comName: 'com1',
  prefs: ['201601002', '201601003'],
};

Committee.create(com1)
  .then(Candidate.create(candidateA))
  .then(Candidate.create(candidateB))
  .then(Candidate.create(candidateC))
  .then(Vote.create(voteCA))
  .then(Vote.create(voteCA))
  .then(Vote.create(voteAB))
  .then(Vote.create(voteA))
  .then(Vote.create(voteBC))
  .then(Vote.create(voteB))
  .then(() => {
    db.close();
  });
