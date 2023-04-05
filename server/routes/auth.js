const express = require('express');
const passport = require('passport');
require('dotenv').config();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/failed', (req, res) => {
  res.status(500).send();
});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'https://www.googleapis.com/auth/drive.readonly'],
    accessType: 'offline',
    prompt: 'consent',
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/failed',
  }),
  (req, res) => {
    res.redirect(process.env.SERVER_URL);
  }
);

router.post('/refresh_token', isAuthenticated, authController.refreshToken);
router.get('/isLoggedIn', authController.isLoggedIn);
router.post(
  '/notifyClientActive',
  isAuthenticated,
  authController.notifyClientActive
);
router.post('/logout', isAuthenticated, authController.logout);

module.exports = router;
