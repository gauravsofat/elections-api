const request = require('supertest');
const server = require('../app');
const Committee = require('../models/committee');
const Candidate = require('../models/candidate');
const Vote = require('../models/vote');
const mongoose = require('mongoose');
const data = require('./data.json');
const { each } = require('async3');

describe('Votes evaluation algorithm tests ', () => {
  beforeEach(async () => {
    await Committee.deleteMany().exec();
    await Vote.deleteMany().exec();
    await Candidate.deleteMany().exec();
  });

  test('Test 1: Basic test', async () => {
    const testData = data.test1;
    await each(testData.committees, async item => {
      await Committee.create(item);
    });
    await each(testData.candidates, async item => {
      await Candidate.create(item);
    });
    await each(testData.votes, async item => {
      for (let i = 0; i < item.count; i++) {
        await Vote.create(item.data);
      }
    });
    await request(server)
      .get('/result')
      .then(res => {
        expect(res.body.allResults[0].winners).toEqual(
          expect.arrayContaining(testData.winners)
        );
      });
  });

  test('Test 2: Multiple committees test', async () => {
    const testData = data.test2;
    await each(testData.committees, async item => {
      await Committee.create(item);
    });
    await each(testData.candidates, async item => {
      await Candidate.create(item);
    });
    await each(testData.votes, async item => {
      for (let i = 0; i < item.count; i++) {
        await Vote.create(item.data);
      }
    });
    await request(server)
      .get('/result')
      .then(res => {
        console.log(res.body.allResults);
        expect(5).toBe(5);
        res.body.allResults.map(item => {
          if (item.comName === 'com1') {
            expect(item.winners[0]).toBe(testData.winners[0].winners[0]);
          } else if (item.comName === 'com2') {
            expect(item.winners[0]).toBe(testData.winners[1].winners[0]);
          } else if (item.comName === 'com1') {
            expect(item.winners[0]).toBe(testData.winners[2].winners[0]);
          }
        });
      });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
