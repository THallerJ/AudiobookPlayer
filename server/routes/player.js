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

		res.status(200).send({ rootFlag: true });
	} catch (error) {
		res.status(500).send();
	}
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

		res.status(200).send("Chapter progress updated");
	} catch (error) {
		res.status(500).send();
	}
});

router.get("/getBooksProgress", async (req, res) => {
	const user = req.user ? req.user[0] : null;

	try {
		const result = user
			? await Chapter.find({
					googleId: user.googleId,
			  }).sort({ updatedAt: -1 })
			: null;

		res.status(200).send(result);
	} catch (error) {
		res.status(500).send();
	}
});

function deleteAllChapterProgress(googleId) {
	Chapter.deleteMany({ googleId: googleId }, (err) => {
		if (err) {
			console.log(err);
		}
	});
}

async function deleteExpiredDocuments() {
	const expireDate = new Date(
		new Date().setDate(new Date().getDate() - 90) // 90 days ago
	);

	await Chapter.deleteMany({
		updatedAt: { $lt: expireDate },
	});

	await User.deleteMany({
		updatedAt: { $lt: expireDate },
	});

	setTimeout(async () => {
		await deleteExpiredDocuments();
	}, 7 * 86400); // 7 days
}

deleteExpiredDocuments();

module.exports = { playerRoute: router, deleteAllChapterProgress };
