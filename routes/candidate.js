const express = require("express");
const candidateController = require("../controllers/candidate");

const router = express.Router();
if (process.env.NODE_ENV !== "dev") router.use(candidateController.isAdmin);
router.post("/", candidateController.addNewCandidate);

module.exports = router;