const User = require("../models/User.js");
const Chapter = require("../models/Chapter.js");
const dbUtils = require("../utils/database-utils");

async function setRootDirectory(req, res) {
	const user = req.authUser;
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

async function setChapterProgress(req, res) {
	const user = req.authUser;

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

		res.status(200).send();
	} catch (error) {
		res.status(500).send();
	}
}

async function getBooksProgress(req, res) {
	const user = req.authUser;

	try {
		const result = await Chapter.find({
			googleId: user.googleId,
		}).sort({ updatedAt: -1 });

		res.status(200).send(result);
	} catch (error) {
		res.status(500).send();
	}
}

module.exports = {
	setRootDirectory,
	setChapterProgress,
	getBooksProgress,
};
