const express = require('express');
require('dotenv').config();
const generalController = require('../controllers/generalController');

const router = express.Router();

router.get('/serverUrl', generalController.getServerUrl);

module.exports = router;
