const async = require("async");
const Candidate = require("../models/candidate");

module.exports = async (minCandidateArr, voteList) => {
  let lastCandidate = await checkCrossPrefs(minCandidateArr, voteList);
  if (lastCandidate == null) {
    console.log("Tie Resolution 2 :- Checking Seniority...");
    lastCandidate = await checkSeniority(minCandidateArr);
  }
  if (lastCandidate == null) {
    console.log("Tie Resolution 3 :- Checking CPI...");
    lastCandidate = await checkCpi(minCandidateArr);
  }
  if (lastCandidate == null) {
    console.log("Tie Resolution 4 :- Elimination By Random Selection...");
    lastCandidate = await randomSelection(minCandidateArr);
  }
  console.log("Tie Resolved!");
  return lastCandidate;
};

async function checkCrossPrefs(minCandidateArr, voteList) {
  console.log("Tie Resolution 1 :- Checking Cross Preferences...");
  console.log("Tie Between: ", minCandidateArr);
  let voteCount = await createVoteCount(minCandidateArr);
  voteCount = await getVoteCount(voteCount, voteList);
  const minVoteCount = Math.min(...Object.values(voteCount));
  const minVoteCandidates = await geMinVoteCandidates(voteCount, minVoteCount);
  // console.log("Required Length :", minVoteCandidates.length);
  if (minVoteCandidates.length == 1) {
    return minVoteCandidates[0];
  } else if (minVoteCandidates.length < minCandidateArr.length) {
    console.log("Tie Situation Persists...");
    return checkCrossPrefs(minVoteCandidates, voteList);
  } else {
    console.log("Tie Situation Persists...");
    return null;
  }
}

async function createVoteCount(minCandidateArr) {
  return new Promise(resolve => {
    let voteCount = {};
    async.each(
      minCandidateArr,
      function(candidateSid, cb) {
        voteCount[candidateSid] = 0;
        cb();
      },
      function(err) {
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
        cb();
      },
      function(err) {
        if (err) throw err;
        resolve(voteCount);
      }
    );
  });
}

async function geMinVoteCandidates(voteCount, minVoteCount) {
  return new Promise(resolve => {
    async.filter(
      Object.keys(voteCount),
      function(candidate, cb) {
        cb(null, voteCount[candidate] == minVoteCount);
      },
      function(err, minVoteCandidates) {
        if (err) throw err;
        resolve(minVoteCandidates);
      }
    );
  });
}

async function checkSeniority(minCandidateArr) {
  let lastCandidate = await checkSeniorityByYear(minCandidateArr);
  if (lastCandidate == null)
    lastCandidate = await checkSeniorityByBatch(minCandidateArr);
  if (lastCandidate == null) console.log("Tie Situation Persists...");
  return lastCandidate;
}

async function checkSeniorityByYear(minCandidateArr) {
  const yearObj = await getYearObj(minCandidateArr);
  const maxYear = Math.max(...Object.values(yearObj));
  const maxYearCandidates = await getMaxYearCandidates(yearObj, maxYear);
  if (maxYearCandidates.length == 1) return maxYearCandidates[0];
  else return null;
}

async function getYearObj(minCandidateArr) {
  return new Promise(resolve => {
    let yearObj = {};
    async.each(
      minCandidateArr,
      function(candidateSid, cb) {
        Candidate.findOne({ sid: candidateSid })
          .exec()
          .then(function(queryResult) {
            yearObj[queryResult.sid] = Number(
              queryResult.batch.substring(0, 2)
            );
            cb();
          });
      },
      function(err) {
        if (err) throw err;
        resolve(yearObj);
      }
    );
  });
}

async function getMaxYearCandidates(yearObj, minYear) {
  return new Promise(resolve => {
    async.filter(
      Object.keys(yearObj),
      function(candidate, cb) {
        cb(null, yearObj[candidate] == minYear);
      },
      function(err, minYearCandidates) {
        if (err) throw err;
        resolve(minYearCandidates);
      }
    );
  });
}

async function checkSeniorityByBatch(minCandidateArr) {
  console.log("Checking Seniority By Batch...");
  const batchObj = await getBatchObj(minCandidateArr);
  const minBatch = Math.min(...Object.values(batchObj));
  const minBatchCandidates = await getMinBatchCandidates(batchObj, minBatch);
  if (minBatchCandidates.length == 1) return minBatchCandidates[0];
  else return null;
}

async function getBatchObj(minCandidateArr) {
  return new Promise(resolve => {
    let batchObj = {};
    async.each(
      minCandidateArr,
      function(candidate, cb) {
        Candidate.findOne({ sid: candidate })
          .exec()
          .then(function(doc) {
            batchObj[doc.sid] = Number(doc.batch.substring(2, 4));
            cb();
          });
      },
      function(err) {
        if (err) throw err;
        resolve(batchObj);
      }
    );
  });
}

async function getMinBatchCandidates(batchObj, minBatch) {
  return new Promise(resolve => {
    async.filter(
      Object.keys(batchObj),
      function(candidate, cb) {
        cb(null, batchObj[candidate] == minBatch);
      },
      function(err, minBatchCandidates) {
        if (err) throw err;
        resolve(minBatchCandidates);
      }
    );
  });
}

async function checkCpi(minCandidateArr) {
  console.log("Checking CPI...");
  const cpiObj = await getCpiObj(minCandidateArr);
  const minCpi = Math.min(...Object.values(cpiObj));
  const minCpiCandidates = await getMinCpiCandidates(cpiObj, minCpi);
  if (minCpiCandidates.length == 1) return minCpiCandidates[0];
  return null;
}

async function getCpiObj(minCandidateArr) {
  return new Promise(resolve => {
    let cpiObj = {};
    async.each(
      minCandidateArr,
      function(candidateSid, cb) {
        Candidate.findOne({ sid: candidateSid })
          .exec()
          .then(function(queryResult) {
            cpiObj[queryResult.sid] = queryResult.cpi;
            cb();
          });
      },
      function(err) {
        if (err) throw err;
        resolve(cpiObj);
      }
    );
  });
}

async function getMinCpiCandidates(cpiObj, minCpi) {
  return new Promise(resolve => {
    async.filter(
      Object.keys(cpiObj),
      function(candidate, cb) {
        cb(null, cpiObj[candidate] == minCpi);
      },
      function(err, minCpiCandidates) {
        if (err) throw err;
        resolve(minCpiCandidates);
      }
    );
  });
}

async function randomSelection(minCandidateArr) {
  console.log("Eliminating Using Random Selection...");
  return minCandidateArr[Math.floor(Math.random() * minCandidateArr.length)];
}
