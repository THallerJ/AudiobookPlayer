const express = require("express");
var router = express.Router();
const User = require("../models/User.js");

router.post("/rootDirectory", async (req, res) => {
	const user = req.user[0];

	const response = await User.updateOne(
		{ googleId: user.googleId },
		{ $set: { rootId: req.body.data.rootId } }
	);

	res.status(200).send("directory saved");
});

module.exports = router;
