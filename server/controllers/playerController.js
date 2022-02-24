const User = require("../models/User.js");
const Chapter = require("../models/Chapter.js");
const dbUtils = require("../utils/database-utils");

async function rootDirectory(req, res, next) {
	const user = req.user[0];
	dbUtils.deleteAllChapterProgress(user.googleId);

	try {
		await User.updateOne(
			{ googleId: user.googleId },
			{ $set: { rootId: req.body.data.rootId } }
		);

		res.status(200).send({ rootFlag: true });
	} catch (error) {
		res.status(500).send();
	}
}

async function setChapterProgress(req, res, next) {
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
}

async function getBooksProgress(req, res, next) {
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
}

module.exports = {
	rootDirectory,
	setChapterProgress,
	getBooksProgress,
};
