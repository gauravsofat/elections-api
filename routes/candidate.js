const express = require('express');
const candidateController = require('../controllers/candidate');

const router = express.Router();
if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test')
  router.use(candidateController.isAdmin);
router.post('/', candidateController.addNewCandidate);
router.get('/', candidateController.getCandidateList);
router.delete('/:candId', candidateController.deleteCandidate);

module.exports = router;
