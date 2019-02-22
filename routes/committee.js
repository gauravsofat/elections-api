const express = require("express");
const comitteeController = require("../controllers/committee");

const router = express.Router();
if (process.env.NODE_ENV !== "dev") router.use(comitteeController.isAdmin);
router.get("/", comitteeController.getCommitteeList);
router.post("/", comitteeController.addNewCommittee);
router.delete("/:comId", comitteeController.deleteCommittee);

module.exports = router;
