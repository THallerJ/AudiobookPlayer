const User = require("../models/User.js");
const encryption = require("../utils/encryption-utils");
const axios = require("axios");
const dbUtils = require("../utils/database-utils");

async function refreshToken(req, res) {
	const user = req.authUser;

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

		res.status(200).send();
	} catch (error) {
		res.status(500).send();
	}
}

function isLoggedIn(req, res) {
	var loggedIn = false;
	var rootFlag = false;

	if (req.user && req.user.length) {
		loggedIn = true;
		rootFlag = req.user[0].rootId ? true : false;
	}

	res.status(200).send({ loggedIn: loggedIn, rootFlag: rootFlag });
}

async function notifyClientActive(req, res) {
	try {
		const googleId = req.authUser.googleId;

		await User.findOneAndUpdate({ googleId: googleId }, [
			{ $set: { notifyFlag: { $eq: [false, "$notifyFlag"] } } },
		]);
	} catch (error) {
		res.status(500).send();
	}

	res.status(200).send();
}

async function revokeAccess(accessToken) {
	await axios.get("https://accounts.google.com/o/oauth2/revoke", {
		params: {
			token: accessToken,
		},
	});
}

async function logout(req, res) {
	const authUser = req.authUser;

	try {
		dbUtils.deleteAllChapterProgress(authUser.googleId);
		await User.deleteOne({ googleId: authUser.googleId });

		await revokeAccess(authUser.accessToken);

		req.logout();
		res.status(200).send();
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
