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

					const coverImageUrl = await getBookCover(book.name);

					const hexColors = await getImageColors(coverImageUrl);

					const tempBook = {
						name: book.name,
						id: book.id,
						chapters: chapters,
						coverImageUrl: coverImageUrl,
						imageColors: hexColors,
					};

					library.push(tempBook);
				})
			);

			res.status(200).send(library);
		} catch (error) {
			console.log(error);
			res.status(401).send("invalid access token");
		}
	} else {
		res.status(200).send([]);
	}
});

async function getBookCover(bookTitle) {
	var coverImageUrl = null;

	try {
		const imageResp = await axios.get(
			"https://www.googleapis.com/books/v1/volumes",
			{
				params: {
					q: `title="${bookTitle}"`,
					orderBy: "relevance",
					printType: "books",
					fields:
						"items(volumeInfo(ratingsCount, imageLinks/thumbnail, title))",
					maxResults: 40,
				},
			}
		);

		const items = imageResp.data.items;

		if (items) {
			const sortedItems = items.length
				? items.sort((a, b) => {
						const ratingsA = a.volumeInfo.ratingsCount;
						const ratingsB = b.volumeInfo.ratingsCount;

						const valA = typeof ratingsA == "undefined" ? -Infinity : ratingsA;
						const valB = typeof ratingsB == "undefined" ? -Infinity : ratingsB;
						return valB - valA;
				  })
				: null;

			var coverFoundFlag = false;

			sortedItems.every((elem, i) => {
				const imageLinks = sortedItems[i].volumeInfo.imageLinks;

				if (imageLinks) {
					const isSameTitle =
						bookTitle.localeCompare(
							sortedItems[i].volumeInfo.title,
							undefined,
							{
								sensitivity: "accent",
							}
						) === 0;

					if (isSameTitle) {
						coverImageUrl = imageLinks.thumbnail;
						return false;
					}

					const isSimilarTitle =
						sortedItems[i].volumeInfo.title.includes(bookTitle) ||
						bookTitle.includes(sortedItems[i].volumeInfo.title);

					if (isSimilarTitle) {
						if (!coverFoundFlag) coverImageUrl = imageLinks.thumbnail;
						coverFoundFlag = true;
						return true;
					}
				}

				return true;
			});
		}
	} catch (error) {
		console.log(error);
	}

	return coverImageUrl;
}

async function getImageColors(imageUrl) {
	var hexColors = [];

	if (imageUrl) {
		const colors = await ColorThief.getPalette(imageUrl, 2);

		colors.forEach((color) => {
			hexColors.push(rgbToHex(color[0], color[1], color[2]));
		});
	} else {
		hexColors.push("#eeeeee", "#eeeeee");
	}

	return hexColors;
}

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
