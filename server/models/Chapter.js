const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
	{
		googleId: String,
		bookId: String,
		chapterId: String,
		progress: Number,
		duration: Number,
	},
	{
		timestamps: {
			createdAt: false,
			updatedAt: true,
		},
	}
);

module.exports = mongoose.model("Chapter", chapterSchema);
