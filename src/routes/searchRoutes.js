const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/globalSearch', searchController.globalSearch);
router.post('/searchByName', searchController.searchByName)
module.exports = router;