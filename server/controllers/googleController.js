require("dotenv").config();
const axios = require("axios");
require("dotenv").config();
const ColorThief = require("colorthief");

async function folders(req, res) {
	const user = req.authUser;
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
		res.status(error.response.status).send();
	}
}

async function stream(req, res) {
	const fileId = req.params.id;

	try {
		const trackUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/?key=${process.env.GOOGLE_API_KEY}&alt=media`;

		res.redirect(302, trackUrl);
	} catch (error) {
		res.status(error.response.status).send();
	}
}

async function library(req, res) {
	const user = req.authUser;
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
								fields: "files(id, name)",
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
						const chapter = {
							name: chap.name,
							id: chap.id,
						};

						chapters.push(chapter);
					});

					const coverImageUrl = await getBookCover(book.name, user.accessToken);

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
			res.status(error.response.status).send();
		}
	} else {
		res.status(200).send([]);
	}
}

async function getBookCover(bookTitle, accessToken) {
	try {
		var coverImageUrl = null;
		const maxResults = 40;
		var startIndex = 0;
		var loop = true;
		var highestRatingsCount = -Infinity;
		const ratingThreshold = 10;
		var matchFound = false;

		while (loop) {
			const imageResp = await axios.get(
				"https://www.googleapis.com/books/v1/volumes",
				{
					params: {
						q: `title="${bookTitle}"`,
						orderBy: "relevance",
						fields:
							"items(volumeInfo(ratingsCount, imageLinks/thumbnail, title))",
						maxResults: maxResults,
						startIndex: startIndex,
						accessToken: accessToken,
					},
				}
			);

			startIndex += maxResults;

			const items = imageResp.data.items;

			if (items && items.length) {
				const sortedItems = items.length
					? items.sort((a, b) => {
							const ratingsA = a.volumeInfo.ratingsCount;
							const ratingsB = b.volumeInfo.ratingsCount;

							const valA =
								typeof ratingsA == "undefined" ? -Infinity : ratingsA;
							const valB =
								typeof ratingsB == "undefined" ? -Infinity : ratingsB;
							return valB - valA;
					  })
					: null;

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

						const bookRatingsCount = sortedItems[i].volumeInfo.ratingsCount;
						const meetsThreshold = bookRatingsCount >= ratingThreshold;

						if (isSameTitle && meetsThreshold) {
							coverImageUrl = imageLinks.thumbnail;
							loop = false;
							return false;
						}

						const isSimilarTitle =
							sortedItems[i].volumeInfo.title.includes(bookTitle) ||
							bookTitle.includes(sortedItems[i].volumeInfo.title);

						if (isSimilarTitle || (isSameTitle && !meetsThreshold)) {
							if (bookRatingsCount > highestRatingsCount && !matchFound) {
								if (isSameTitle) matchFound = true;
								coverImageUrl = imageLinks.thumbnail;
								highestRatingsCount = bookRatingsCount;
							}

							return true;
						}
					}

					return true;
				});
			} else {
				loop = false;
			}
		}
	} catch (error) {
		return error;
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

module.exports = {
	folders,
	library,
	stream,
};
