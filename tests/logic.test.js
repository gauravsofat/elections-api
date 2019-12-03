const request = require('supertest');
const server = require('../app');
const Committee = require('../models/committee');
const Candidate = require('../models/candidate');
const Vote = require('../models/vote');
const mongoose = require('mongoose');

beforeAll(async () => {
  await Committee.deleteMany().exec();
  await Vote.deleteMany().exec();
  await Candidate.deleteMany().exec();
  const com1 = {
    comName: 'com1',
    seats: 1,
    batches: ['1601'],
    candidates: [
      { sid: '201601006', name: 'A' },
      { sid: '201601004', name: 'B' },
    ],
  };
  const candidateA = {
    sid: '201601006',
    name: 'A',
    comName: 'com1',
    batch: '1601',
    cpi: 7.5,
  };
  const candidateB = {
    sid: '201601004',
    name: 'B',
    comName: 'com1',
    batch: '1601',
    cpi: 7.9,
  };
  const voteAB = {
    sid: '201601201',
    batch: '1601',
    comName: 'com1',
    prefs: ['201601006', '201601004'],
  };
  const voteBA = {
    sid: '201601201',
    batch: '1601',
    comName: 'com1',
    prefs: ['201601004', '201601006'],
  };
  const voteA = {
    sid: '201601201',
    batch: '1601',
    comName: 'com1',
    prefs: ['201601006'],
  };
  const voteB = {
    sid: '201601201',
    batch: '1601',
    comName: 'com1',
    prefs: ['201601004'],
  };
  await Committee.create(com1)
    .then(Candidate.create(candidateA))
    .then(Candidate.create(candidateA))
    .then(Candidate.create(candidateB))
    .then(Vote.create(voteAB))
    .then(Vote.create(voteAB))
    .then(Vote.create(voteAB))
    .then(Vote.create(voteAB))
    .then(Vote.create(voteA))
    .then(Vote.create(voteA))
    .then(Vote.create(voteBA))
    .then(Vote.create(voteBA))
    .then(Vote.create(voteB))
    .then(Vote.create(voteB));
});

// A: 6, B: 4, A wins, One Iteration, No Ties
test('Vote Logic Test 1', async () => {
  await request(server)
    .get('/result')
    .then(res => {
      expect(res.body.allResults[0].winners[0]).toBe('201601006');
    });
});

afterAll(() => {
  mongoose.connection.close();
});
