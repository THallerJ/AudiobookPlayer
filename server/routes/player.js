const express = require("express");
const Chapter = require("../models/Chapter.js");
var router = express.Router();
const User = require("../models/User.js");

router.post("/rootDirectory", async (req, res) => {
	const user = req.user[0];

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
	const time = req.body.data.time;

	try {
		await Chapter.findOneAndUpdate(
			{
				googleId: user.googleId,
				bookId: bookId,
			},
			{
				$set: {
					chapterId: chapterId,
					time: time,
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
	const user = req.user[0];

	const result = await Chapter.find({
		googleId: user.googleId,
	});

	const returnValue = result.reduce(
		(map, obj) => (
			(map[obj.bookId] = { chapterId: obj.chapterId, time: obj.time }), map
		),
		{}
	);

	res.status(200).send(returnValue);
});

router.post("/deleteAllChapterProgress", async (req, res) => {
	Chapter.deleteMany({ googleId: req.user[0].googleId }, (err) => {
		if (err) {
			console.log(err);
		}
	});

	res.sendStatus(200);
});

module.exports = router;
