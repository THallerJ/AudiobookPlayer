require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const encryption = require('../utils/encryption-utils');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.find({ googleId: id });

    if (user.length) {
      const encryptedAccessToken = user[0].accessToken;
      const encryptedRefreshToken = user[0].refreshToken;

      user[0].accessToken = encryption.decryptText(encryptedAccessToken);
      user[0].refreshToken = encryption.decryptText(encryptedRefreshToken);

      done(null, user);
    } else {
      done(null, false);
    }
  } catch (e) {
    done(e);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const userExists = await User.findOne({ googleId: profile.id });

      if (!userExists) {
        const user = new User({
          googleId: profile.id,
          rootId: null,
          accessToken: encryption.encryptText(accessToken),
          refreshToken: encryption.encryptText(refreshToken),
          notifyFlag: false,
          rootUpdatedAt: null,
        });

        user.save();
      }

      return done(null, profile);
    }
  )
);
