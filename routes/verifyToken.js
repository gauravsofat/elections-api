const express = require("express");
const verifyTokenController = require("../controllers/verifyToken");

const router = express.Router();
router.get("/", verifyTokenController.verify);

module.exports = router;
