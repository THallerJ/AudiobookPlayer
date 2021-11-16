const express = require("express");
var router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.get("/folders", async (req, res) => {
	const token = req.user[0].accessToken;
	console.log("folders called");

	//rewrite to accept fileId as parameter. Use root as fileId on first call, use selected fileId on successive calls
	try {
		const response = await axios.get(
			"https://www.googleapis.com/drive/v3/files",
			{
				headers: {
					Authorization: `Bearer ${token}`,
					refresh_token: req.user[0].refreshToken,
					google_id: req.user[0].googleId,
				},
				params: {
					q: `\"root\" in parents and mimeType=\"application/vnd.google-apps.folder\" and trashed = false`,
				},
			}
		);

		res.send(response.data.files);
	} catch (error) {
		res.status(401).send("invalid access token");
	}
});

module.exports = router;
