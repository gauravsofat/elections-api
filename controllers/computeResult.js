const async = require("async");
const resolveTie = require("./resolveTie");
const Vote = require("../models/vote");

module.exports = async comList => {
  return new Promise(resolve => {
    async.mapSeries(comList, getCommitteeResults, function(err, allResults) {
      if (err) throw err;
      resolve(allResults);
    });
  });
};

async function getCommitteeResults(committee) {
  return new Promise(async resolve => {
    const committeeResult = {};
    committeeResult.comName = committee.comName;
    committeeResult.batches = committee.batches;

    voteList = await getVoteList(committee);

    const numOfSeats = committee.seats;
    let activeCandidates = committee.candidates.length;

    voteCount = await createVoteCount(committee);
    voteCount = await getVoteCount(voteCount, voteList);

    console.log("*".repeat(25));
    console.log("Committee Name: ", committeeResult.comName);
    console.log("Participating Batches: ", committeeResult.batches);
    console.log("Number Of Positions: ", numOfSeats);
    console.log("\n");

    async.whilst(
      function() {
        return activeCandidates > numOfSeats;
      },
      async function() {
        return new Promise(async resolve => {
          console.log(voteCount);
          lastCandidate = await getLastCandidate(voteCount, voteList);
          console.log("Eliminated Candidate: ", lastCandidate);
          console.log("\n");
          delete voteCount[lastCandidate];
          activeCandidates--;
          voteList = await updateVoteList(voteCount, voteList);
          voteCount = await resetVoteCount(voteCount);
          voteCount = await getVoteCount(voteCount, voteList);
          resolve(voteCount);
        });
      },
      function(err, voteCount) {
        if (err) throw err;
        console.log(voteCount);
        committeeResult.candidates = committee.candidates;
        committeeResult.winners = Object.keys(voteCount);
        console.log("Elected Candidates: ", committeeResult.winners);
        console.log("*".repeat(25));
        console.log("\n");
        resolve(committeeResult);
      }
    );
  });
}

async function getVoteList(committee) {
  return new Promise(resolve => {
    Vote.find({ comName: committee.comName, batch: committee.batches })
      .exec()
      .then(function(voteList) {
        resolve(voteList);
      })
      .catch(function(err) {
        console.log(err);
        res.status(500).send("Database Error. Failed To Obtain Vote List.");
      });
  });
}

async function createVoteCount(committee) {
  return new Promise(resolve => {
    const voteCount = {};
    Promise.all(
      committee.candidates.map(candidate => (voteCount[candidate.sid] = 0))
    ).then(resolve(voteCount));
  });
}

async function getVoteCount(voteCount, voteList) {
  return new Promise(resolve => {
    async.transform(
      voteList,
      voteCount,
      function(voteCount, vote, index, cb) {
        if (vote.prefs.length) voteCount[vote.prefs[0]]++;
        cb();
      },
      function(err, initialVoteCount) {
        if (err) throw err;
        resolve(initialVoteCount);
      }
    );
  });
}

async function getLastCandidate(voteCount, voteList) {
  return new Promise(async resolve => {
    const minCandidateArr = await getMinCandidateArr(voteCount);
    if (minCandidateArr.length == 1) resolve(minCandidateArr[0]);
    else {
      console.log("Tie Situation");
      const lastCandidate = await resolveTie(minCandidateArr, voteList);
      resolve(lastCandidate);
    }
  });
}

async function getMinCandidateArr(voteCount) {
  return new Promise(resolve => {
    const minVotes = Math.min(...Object.values(voteCount));
    const minCandidateArr = [];
    async.each(
      Object.keys(voteCount),
      function(candidate, cb) {
        if (voteCount[candidate] == minVotes) minCandidateArr.push(candidate);
        cb();
      },
      function(err) {
        if (err) throw err;
        resolve(minCandidateArr);
      }
    );
  });
}

async function resetVoteCount(voteCount) {
  return new Promise(resolve => {
    async.each(
      Object.keys(voteCount),
      function(candidate, cb) {
        voteCount[candidate] = 0;
        cb();
      },
      function(err) {
        if (err) throw err;
        resolve(voteCount);
      }
    );
  });
}

async function updateVoteList(voteCount, voteList) {
  return new Promise(resolve => {
    async.each(
      voteList,
      function(vote, eachCb) {
        async.filter(
          vote.prefs,
          function(pref, filterCb) {
            filterCb(null, voteCount.hasOwnProperty(pref));
          },
          function(err, updatedPrefs) {
            if (err) throw err;
            vote.prefs = updatedPrefs;
            eachCb();
          }
        );
      },
      function(err) {
        if (err) throw err;
        resolve(voteList);
      }
    );
  });
}
