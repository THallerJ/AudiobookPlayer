const express = require("express");
const passport = require("passport");
var router = express.Router();
const User = require("../models/User.js");
const axios = require("axios");
require("dotenv").config();

router.get("/failed", (req, res) => {
	res.send("<h1>Log in Failed :(</h1>");
});

const checkUserLoggedIn = (req, res, next) => {
	req.user ? next() : res.sendStatus(401);
};

router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "https://www.googleapis.com/auth/drive.readonly"],
		accessType: "offline",
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

router.get("/refresh_token", async (req, res) => {
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
			res.send({ result: true });
			return;
		}
	}

	res.send({ result: false });
});

router.get("/logout", (req, res) => {
	res.send("hello");
	//req.session = null;
	//req.logout();
	//res.redirect("/");
});

module.exports = router;
