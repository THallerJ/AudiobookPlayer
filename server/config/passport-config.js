require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User.js");
const encryption = require("../utils/encryption-utils");

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.find({ googleId: id }, (err, user) => {
		const encryptedAccessToken = user[0].accessToken;
		const encryptedRefreshToken = user[0].refreshToken;

		user[0].accessToken = encryption.decryptText(encryptedAccessToken);
		user[0].refreshToken = encryption.decryptText(encryptedRefreshToken);
		done(err, user);
	});
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

				user.save((err, result) => {
					if (err) console.log(err);
				});
			}

			return done(null, profile);
		}
	)
);
