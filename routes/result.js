const express = require("express");
const resultController = require("../controllers/result");

const router = express.Router();
if (process.env.NODE_ENV !== "dev") router.use(resultController.isAdmin);
router.get("/stats", resultController.getStats);
router.get("/", resultController.evaluateResult);

module.exports = router;
