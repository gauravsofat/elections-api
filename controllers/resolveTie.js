const async = require("async");
const Candidate = require("../models/candidate");

module.exports = async (minCandidateArr, voteList) => {
  let lastCandidate = await checkCrossPrefs(minCandidateArr, voteList);
  if (lastCandidate == null)
    lastCandidate = await checkSeniority(minCandidateArr);
  if (lastCandidate == null) lastCandidate = await checkCpi(minCandidateArr);
  if (lastCandidate == null)
    lastCandidate = await randomSelection(minCandidateArr);
  return lastCandidate;
};

async function checkCrossPrefs(minCandidateArr, voteList) {
  let voteCount = await createVoteCount(minCandidateArr);
  voteCount = getVoteCount(voteCount, voteList);
  const minVoteCount = Math.min(...Object.value(voteCount));
  const minVoteCandidateArr = await geMinVoteCandidateArr(
    voteCount,
    minVoteCount
  );
  if (minVoteCandidateArr.length == 1) return minVoteCandidateArr[0];
  else return null;
}

async function createVoteCount(minCandidateArr) {
  return new Promise(resolve => {
    let voteCount = {};
    async.transform(
      minCandidateArr,
      voteCount,
      function(voteCount, candidate, index, cb) {
        voteCount[candidate] = 0;
        cb(); // Is This Really Required?
      },
      function(err, voteCount) {
        if (err) throw err;
        resolve(voteCount);
      }
    );
  });
}

async function getVoteCount(voteCount, voteList) {
  return new Promise(resolve => {
    async.each(
      voteList,
      function(vote, cb) {
        if (
          vote.prefs.length > 1 &&
          voteCount.hasOwnProperty(vote.prefs[0]) &&
          voteCount.hasOwnProperty(vote.prefs[1])
        )
          voteCount[vote.prefs[1]]++;
      },
      function(err) {
        if (err) throw err;
        resolve(voteCount);
      }
    );
  });
}

async function geMinVoteCandidateArr(voteCount, minVoteCount) {
  return new Promise(resolve => {
    async.filter(
      voteCount,
      function(candidate, cb) {
        cb(null, voteCount[candidate] == minVoteCount);
      },
      function(err, minVoteCandidateArr) {
        if (err) throw err;
        resolve(minVoteCandidateArr);
      }
    );
  });
}

async function checkSeniority(minCandidateArr) {
  let lastCandidate = await checkSeniorityByYear(minCandidateArr);
  if (lastCandidate == null)
    lastCandidate = await checkSeniorityByBatch(minCandidateArr);
  return lastCandidate;
}

async function checkSeniorityByYear(minCandidateArr) {
  const yearArr = await getYearArr(minCandidateArr);
  const minYear = Math.min(...yearArr);
  const minYearCandidates = await getMinYearCandidates(yearArr, minYear);
  if (minYearCandidates.length == 1) return minYearCandidates[0];
  else return null;
}

async function getYearArr(minCandidateArr) {
  return new Promise(resolve => {
    async.map(
      minCandidateArr,
      function(candidate) {
        return Candidate.find({ sid: candidate })
          .exec()
          .then(function(doc) {
            return Number(doc.batch.substring(0, 2));
          });
      },
      function(err, yearArr) {
        if (err) throw err;
        resolve(yearArr);
      }
    );
  });
}

async function getMinYearCandidates(yearArr, minYear) {
  return new Promise(resolve => {
    async.filter(
      yearArr,
      function(candidate, cb) {
        cb(null, candidate == minYear);
      },
      function(err, minYearCandidates) {
        if (err) throw err;
        resolve(minYearCandidates);
      }
    );
  });
}

async function checkSeniorityByBatch(minCandidateArr) {
  const batchArr = await getBatchArr(minCandidateArr);
  const maxBatch = Math.max(...batchArr);
  const maxBatchCandidates = await getMaxBatchCandidates(batchArr, maxBatch);
  if (maxBatchCandidates.length == 1) return maxBatchCandidates[0];
  else return null;
}

async function getBatchArr(minCandidateArr) {
  return new Promise(resolve => {
    async.map(
      minCandidateArr,
      function(candidate) {
        return Candidate.find({ sid: candidate })
          .exec()
          .then(function(doc) {
            return Number(doc.batch.subtring(2, 4));
          });
      },
      function(err, batchArr) {
        if (err) throw err;
        resolve(batchArr);
      }
    );
  });
}

async function getMaxBatchCandidates(batchArr, maxBatch) {
  return new Promise(resolve => {
    async.filter(
      batchArr,
      function(candidateBatch, cb) {
        cb(null, candidateBatch == maxBatch);
      },
      function(err, maxBatchCandidates) {
        if (err) throw err;
        resolve(maxBatchCandidates);
      }
    );
  });
}

async function checkCpi(minCandidateArr) {
  const cpiArr = await getCpiArr(minCandidateArr);
  const minCpi = Math.min(...cpiArr);
  const minCpiCandidates = await getMinCpiCandidates(cpiArr, minCpi);
  if (minCpiCandidates.length == 1) return minCpiCandidates[0];
  return null;
}

async function getCpiArr(minCandidateArr) {
  return new Promise(resolve => {
    async.map(
      minCandidateArr,
      function(candidate) {
        return Candidate.find({ sid: candidate })
          .exec()
          .then(function(doc) {
            return doc.cpi;
          });
      },
      function(err, cpiArr) {
        if (err) throw err;
        resolve(cpiArr);
      }
    );
  });
}

async function getMinCpiCandidates(cpiArr, minCpi) {
  return new Promise(resolve => {
    async.filter(
      cpiArr,
      function(candidateCpi, cb) {
        cb(null, candidateCpi == minCpi);
      },
      function(err, minCpiCandidates) {
        if (err) throw err;
        resolve(minCpiCandidates);
      }
    );
  });
}

async function randomSelection(minCandidateArr) {
  return minCandidateArr[Math.floor(Math.random() * minCandidateArr.length)];
}
