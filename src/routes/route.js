// routes.js
const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const contactRoutes = require("./contactRoutes");
const spamRoutes = require("./spamRoutes");
const searchRoutes = require("./searchRoutes");
const tokenVerification = require("../middleware/authVerify");

router.use("/user", userRoutes);
router.use("/contact", tokenVerification, contactRoutes);
router.use("/spam", tokenVerification, spamRoutes);
router.use("/search", tokenVerification, searchRoutes);

module.exports = router;
