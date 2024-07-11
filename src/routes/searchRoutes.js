const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");

router.get("/globalSearch", searchController.globalSearch);
router.post("/searchByName", searchController.SearchByName);
router.post("/searchByPhone", searchController.searchByPhone);

module.exports = router;
