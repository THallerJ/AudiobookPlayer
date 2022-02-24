const User = require("../models/User.js");
const encryption = require("../utils/encryption-utils");
const axios = require("axios");
const dbUtils = require("../utils/database-utils");

async function refreshToken(req, res, next) {
	const user = req.user[0];

	try {
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
			{ $set: { accessToken: encryption.encryptText(accessToken) } }
		);

		res.status(200).send("Token refreshed");
	} catch (error) {
		res.status(500).send();
	}
}

function isLoggedIn(req, res, next) {
	if (req.user) {
		if (req.user.length) {
			res.send({
				loggedIn: true,
				rootFlag: req.user[0].rootId ? true : false,
			});

			return;
		}
	}

	res.status(200).send({ loggedIn: false, rootFlag: false });
}

async function notifyClientActive(req, res, next) {
	try {
		if (req.user) {
			const googleId = req.user[0].googleId;

			await User.findOneAndUpdate({ googleId: googleId }, [
				{ $set: { notifyFlag: { $eq: [false, "$notifyFlag"] } } },
			]);
		}
	} catch (error) {
		res.status(500).send();
	}

	res.status(200).send();
}

function logout(req, res, next) {
	const googleId = req.user[0].googleId;

	try {
		dbUtils.deleteAllChapterProgress(googleId);

		User.deleteOne({ googleId: googleId }, (err) => {
			if (err) {
				console.log(err);
			}
		});

		req.logout();
		res.status(200).send("Logged out");
	} catch (error) {
		res.status(500).send();
	}
}

module.exports = {
	refreshToken,
	isLoggedIn,
	notifyClientActive,
	logout,
};
