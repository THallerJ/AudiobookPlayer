require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/User.js");

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.find({ googleId: id }, (err, user) => {
		done(err, user);
	});
});

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_URL,
		},
		async (accessToken, refreshToken, profile, done) => {
			const userExists = await User.findOne({ googleId: profile.id });

			if (!userExists) {
				const user = new User({
					googleId: profile.id,
					rootId: null,
					accessToken: accessToken,
					refreshToken: refreshToken,
					notifyFlag: false,
				});

				user.save((err, result) => {
					if (err) console.log(err);
				});
			}

			return done(null, profile);
		}
	)
);
