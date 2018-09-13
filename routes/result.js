const express = require("express");
const resultController = require("../controllers/result");

const router = express.Router();
// router.use(resultController.isAdmin);
router.get("/", resultController.evaluateResult);

module.exports = router;
