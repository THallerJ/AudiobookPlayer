const express = require("express");
const Chapter = require("../models/Chapter.js");
var router = express.Router();
const User = require("../models/User.js");

router.post("/rootDirectory", async (req, res) => {
	const user = req.user[0];
	deleteAllChapterProgress(user.googleId);

	try {
		await User.updateOne(
			{ googleId: user.googleId },
			{ $set: { rootId: req.body.data.rootId } }
		);
	} catch (error) {
		console.log(error);
	}

	res.status(200).send({ rootFlag: true });
});

router.post("/setChapterProgress", async (req, res) => {
	const user = req.user[0];

	const bookId = req.body.data.bookId;
	const chapterId = req.body.data.chapterId;
	const progress = req.body.data.progress;
	const duration = req.body.data.duration;

	try {
		await Chapter.findOneAndUpdate(
			{
				googleId: user.googleId,
				bookId: bookId,
			},
			{
				$set: {
					chapterId: chapterId,
					progress: progress,
					duration: duration,
				},
			},
			{ upsert: true }
		);
	} catch (error) {
		console.log(error);
	}

	res.sendStatus(200);
});

router.get("/getBooksProgress", async (req, res) => {
	const user = req.user ? req.user[0] : null;

	const result = user
		? await Chapter.find({
				googleId: user.googleId,
		  }).sort({ updatedAt: -1 })
		: null;

	res.status(200).send(result);
});

function deleteAllChapterProgress(googleId) {
	Chapter.deleteMany({ googleId: googleId }, (err) => {
		if (err) {
			console.log(err);
		}
	});
}

module.exports = { playerRoute: router, deleteAllChapterProgress };
