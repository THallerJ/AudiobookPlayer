const express = require("express");
const ColorThief = require("colorthief");
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
		res.status(error.code).send("invalid access token");
	}
});

async function getBookCovers(bookTitle) {
	const resp = await axios.get("https://www.googleapis.com/books/v1/volumes", {
		params: {
			q: `title="${bookTitle}"`,
			orderBy: "relevance",
			printType: "books",
			fields: "items(volumeInfo(ratingsCount, imageLinks/thumbnail))",
		},
	});

	console.log(resp.data.items);
	return resp.data;
}

router.get("/library", async (req, res) => {
	const user = req.user[0];
	const directory = user.rootId;

	if (directory) {
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
				bookResp.data.files.map(async (book) => {
					const chapResp = await axios.get(
						"https://www.googleapis.com/drive/v3/files",
						{
							headers: {
								Authorization: `Bearer ${user.accessToken}`,
							},
							params: {
								q: `\"${book.id}\" in parents and trashed = false`,
							},
						}
					);

					const chapters = [];

					const sortedChaps = chapResp.data.files.sort((chap1, chap2) => {
						const num1 = extractLastNumber(chap1.name);
						const num2 = extractLastNumber(chap2.name);

						return num1 && num2 ? num1 - num2 : 0;
					});

					sortedChaps.forEach((chap) => {
						const chapter = { name: chap.name, id: chap.id };
						chapters.push(chapter);
					});

					const images = await axios.get(
						"https://www.googleapis.com/books/v1/volumes",
						{
							params: {
								q: `title="${book.name}"`,
								orderBy: "relevance",
								printType: "books",
								fields:
									"items(volumeInfo(ratingsCount, imageLinks/thumbnail, title))",
								maxResults: 40,
							},
						}
					);

					const tempBook = {
						name: book.name,
						id: book.id,
						chapters: chapters,
						queryResponse: images.data.items,
					};

					console.log(tempBook);

					library.push(tempBook);
				})
			);

			res.status(200).send(library);
		} catch (error) {
			console.log(error);
			res.status(402).send("invalid access token");
		}
	} else {
		res.status(200).send([]);
	}
});

/* returns last integer in a string, not including integers that appear 
   after a period to account for integers that appear in file extensions (i.e. .mp3) */
function extractLastNumber(a) {
	var numStr;

	if (a.includes(".")) {
		numStr = a.substr(0, a.indexOf(".")).match(/\d+$/);
	} else {
		numStr = a.match(/\d+$/);
	}

	return numStr ? parseInt(numStr[0]) : null;
}

function rgbToHex(r, g, b) {
	return (
		"#" +
		[r, g, b]
			.map((x) => {
				const hex = x.toString(16);
				return hex.length === 1 ? "0" + hex : hex;
			})
			.join("")
	);
}
module.exports = router;
