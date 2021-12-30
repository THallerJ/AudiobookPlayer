const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
	googleId: String,
	bookId: String,
	chapterId: String,
	time: String,
});

module.exports = mongoose.model("Chapter", chapterSchema);
