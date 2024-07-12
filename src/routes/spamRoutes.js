const express = require("express");
const router = express.Router();
const spamController = require("../controllers/spamController");

router.post("/setSpam", spamController.setSpam);

module.exports = router;
