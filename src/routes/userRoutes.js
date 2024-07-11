const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

//Register User Logic Here
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

module.exports = router;
