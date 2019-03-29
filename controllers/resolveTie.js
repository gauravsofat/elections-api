const async = require("async");
const Candidate = require("../models/candidate");

module.exports = async (minCandidateArr, voteList) => {
  console.log("MinCandidateArr", minCandidateArr);
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
  return new Promise(resolve => {
    minYr = 100;
    async.transform(
      minCandidateArr,
      (acc, it, ind, cb) => {
        candYr = Number(it.substring(2, 4));
        minYr = Math.min(minYr, candYr);
        acc.push({ sid: it, year: candYr });
        cb(null);
      },
      (err, yearObj) => {
        if (err) console.log("Error During Year-wise Tie Resolution");
        async.filter(
          yearObj,
          (it, cb) => cb(null, it.year !== minYr),
          (err, res) => {
            if (err) console.log(err);
            // console.log("res", res);
            if (res.length == 1) resolve(res[0].sid);
            else {
              console.log("Tie Situation Persists...");
              resolve(null);
            }
          }
        );
      }
    );
  });
}

async function checkCpi(minCandidateArr) {
  return new Promise(resolve => {
    minCpi = 10;
    async.transform(
      minCandidateArr,
      (acc, it, ind, cb) => {
        Candidate.findOne({ sid: it }, (err, doc) => {
          if (err)
            console.log("Database Error. Failed to get candidate info.", err);
          minCpi = Math.min(minCpi, doc.cpi);
          acc.push({ sid: it, cpi: doc.cpi });
          cb(null);
        });
      },
      (err, cpiObj) => {
        if (err) console.log("Error During CPI-based Tie Resolution");
        async.filter(
          cpiObj,
          (it, cb) => cb(null, it.cpi !== minCpi),
          (err, res) => {
            if (err) console.log(err);
            // console.log("res", res);
            if (res.length == 1) resolve(res[0].sid);
            else resolve(null);
          }
        );
      }
    );
  });
}

async function randomSelection(minCandidateArr) {
  console.log("Eliminating Using Random Selection...");
  return minCandidateArr[Math.floor(Math.random() * minCandidateArr.length)];
}
