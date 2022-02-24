const User = require("../models/User.js");
const Chapter = require("../models/Chapter.js");

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

function deleteAllChapterProgress(googleId) {
	Chapter.deleteMany({ googleId: googleId }, (err) => {
		if (err) {
			console.log(err);
		}
	});
}

module.exports = {
	deleteExpiredDocuments,
	deleteAllChapterProgress,
};
