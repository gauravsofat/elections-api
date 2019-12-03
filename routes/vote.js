const express = require('express');
const voteController = require('../controllers/vote');

const router = express.Router();
if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test')
  router.use(voteController.canUserVote);
router.post('/', voteController.submitVote);
module.exports = router;
