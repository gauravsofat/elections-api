const express = require("express");
const voteController = require("../controllers/vote");

const router = express.Router();
router.post("/", voteController.canUserVote, voteController.submitVote);
module.exports = router;
