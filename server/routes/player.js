const express = require("express");
var router = express.Router();
const User = require("../models/User.js");

router.post("/rootDirectory", async (req, res) => {
	const user = req.user[0];

	await User.updateOne(
		{ googleId: user.googleId },
		{ $set: { rootId: req.body.data.rootId } }
	);

	res.status(200).send({ rootFlag: true });
});

router.post("/setChapterProgress", async (req, res) => {
	const user = req.user[0];

	const chapterId = req.body.data.chapterId;
	const bookId = req.body.data.bookId;
	const time = req.body.data.time;

	console.log(`chapterId: ${chapterId}\nbookId: ${bookId}\ntime: ${time}`);

	res.status(200).send("ok");
});

module.exports = router;
