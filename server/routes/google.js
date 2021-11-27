const express = require("express");
var router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.get("/folders", async (req, res) => {
	const user = req.user[0];
	const directory = req.query.directory ? req.query.directory : "root";

	try {
		const response = await axios.get(
			"https://www.googleapis.com/drive/v3/files",
			{
				headers: {
					Authorization: `Bearer ${user.accessToken}`,
				},
				params: {
					q: `\"${directory}\" in parents and mimeType=\"application/vnd.google-apps.folder\" and trashed = false`,
				},
			}
		);

		res.send(response.data.files);
	} catch (error) {
		res.status(401).send("invalid access token");
	}
});

router.get("/library", async (req, res) => {
	const user = req.user[0];
	const directory = user.rootId;

	try {
		const bookResp = await axios.get(
			"https://www.googleapis.com/drive/v3/files",
			{
				headers: {
					Authorization: `Bearer ${user.accessToken}`,
				},
				params: {
					q: `\"${directory}\" in parents and mimeType=\"application/vnd.google-apps.folder\" and trashed = false`,
				},
			}
		);

		const library = [];

		await Promise.all(
			bookResp.data.files.map(async (file) => {
				const chapResp = await axios.get(
					"https://www.googleapis.com/drive/v3/files",
					{
						headers: {
							Authorization: `Bearer ${user.accessToken}`,
						},
						params: {
							q: `\"${file.id}\" in parents and trashed = false`,
						},
					}
				);

				const chapters = [];

				chapResp.data.files.forEach((file) => {
					const chapter = { name: file.name, id: file.id };
					chapters.push(chapter);
				});

				const book = { name: file.name, id: file.id, chapters: chapters };
				library.push(book);
			})
		);

		res.status(200).send(library);
	} catch (error) {
		res.status(401).send("invalid access token");
	}
});

module.exports = router;
