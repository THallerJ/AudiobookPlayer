const express = require("express");
const passport = require("passport");
var router = express.Router();
const { deleteAllChapterProgress } = require("./player");
const User = require("../models/User.js");
const axios = require("axios");
require("dotenv").config();

router.get("/failed", (req, res) => {
	res.send("<h1>Log in Failed :(</h1>");
});

router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "https://www.googleapis.com/auth/drive.readonly"],
		accessType: "offline",
		prompt: "consent",
	})
);

router.get(
	"/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/failed",
	}),
	(req, res) => {
		res.redirect(process.env.CLIENT_URL);
	}
);

router.post("/refresh_token", async (req, res) => {
	const user = req.user[0];

	const response = await axios.post(
		"https://accounts.google.com/o/oauth2/token",
		{
			grant_type: "refresh_token",
			client_id: process.env.GOOGLE_CLIENT_ID,
			client_secret: process.env.GOOGLE_CLIENT_SECRET,
			refresh_token: decodeURIComponent(user.refreshToken),
		}
	);

	const accessToken = response.data.access_token;

	await User.updateOne(
		{ googleId: user.googleId },
		{ $set: { accessToken: accessToken } }
	);

	res.status(200).send("token refreshed");
});

router.get("/isLoggedIn", (req, res) => {
	if (req.user) {
		if (req.user.length > 0) {
			res.send({
				loggedIn: true,
				rootFlag: req.user[0].rootId ? true : false,
			});

			return;
		}
	}

	res.send({ loggedIn: false, rootFlag: false });
});

router.post("/logout", (req, res) => {
	const googleId = req.user[0].googleId;

	deleteAllChapterProgress(googleId);

	User.deleteOne({ googleId: googleId }, (err) => {
		if (err) {
			console.log(err);
		}
	});

	req.logout();
	res.status(200).send("logged out");
});

module.exports = router;
