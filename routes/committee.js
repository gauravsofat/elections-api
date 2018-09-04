const express = require("express");
const comitteeController = require("../controllers/committee");

const router = express.Router();
router.use(comitteeController.isAdmin);
router.get("/", comitteeController.getCommitteeList);
router.post("/", comitteeController.addNewCommittee);

module.exports = router;
