const User = require('../models/User');
const Chapter = require('../models/Chapter');
const dbUtils = require('../utils/database-utils');

const setRootDirectory = async (req, res) => {
  const user = req.authUser;
  dbUtils.deleteAllChapterProgress(user.googleId);

  try {
    const date = new Date();
    await User.updateOne(
      { googleId: user.googleId },
      { $set: { rootId: req.body.data.rootId, rootUpdatedAt: date } }
    );

    res.status(200).send({ rootUpdatedAt: date });
  } catch (error) {
    res
      .status(500)
      .send({ error: 'There was a problem setting the root directory' });
  }
};

const setChapterProgress = async (req, res) => {
  const user = req.authUser;

  const bookId = req.body.data.bookId;
  const chapterId = req.body.data.chapterId;
  const progress = req.body.data.progress;
  const duration = req.body.data.duration;

  try {
    await Chapter.findOneAndUpdate(
      {
        googleId: user.googleId,
        bookId,
      },
      {
        $set: {
          chapterId,
          progress,
          duration,
        },
      },
      { upsert: true }
    );

    res.status(200).send();
  } catch (error) {
    res
      .status(500)
      .send({ error: "There was a problem saving the user's progress" });
  }
};

const getBooksProgress = async (req, res) => {
  const user = req.authUser;

  try {
    const result = await Chapter.find({
      googleId: user.googleId,
    }).sort({ updatedAt: -1 });

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      error: "There was a problem retrieving the user's book progress",
    });
  }
};

module.exports = {
  setRootDirectory,
  setChapterProgress,
  getBooksProgress,
};
