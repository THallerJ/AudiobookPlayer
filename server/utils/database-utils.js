const User = require('../models/User');
const Chapter = require('../models/Chapter');

const deleteExpiredDocuments = async () => {
  const expireDate = new Date(
    new Date().setDate(new Date().getDate() - 90) // 90 days ago
  );

  await Chapter.deleteMany({
    updatedAt: { $lt: expireDate },
  }).exec();

  await User.deleteMany({
    updatedAt: { $lt: expireDate },
  }).exec();
};

// execute deleteExpiredDocuments every 7 days
setInterval(() => {
  deleteExpiredDocuments();
}, 7 * 86400 * 1000);

const deleteAllChapterProgress = (googleId) => {
  Chapter.deleteMany({ googleId }).exec();
};

module.exports = {
  deleteExpiredDocuments,
  deleteAllChapterProgress,
};
