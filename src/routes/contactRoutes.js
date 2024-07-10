const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/createContact', contactController.createContact);
router.post('/setSpam',contactController.setSpam)
module.exports = router;                                                                                            