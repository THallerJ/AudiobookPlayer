const express = require('express');
require('dotenv').config();
const googleController = require('../controllers/googleController');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/folders', isAuthenticated, googleController.fetchFolders);
router.get('/library', isAuthenticated, googleController.getLibrary);
router.get('/stream/:id', isAuthenticated, googleController.streamProxy);
router.get('/getBookCovers', isAuthenticated, googleController.getBookCovers);

module.exports = router;
