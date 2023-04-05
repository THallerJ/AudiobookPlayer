const axios = require('axios');
const User = require('../models/User');
const encryption = require('../utils/encryption-utils');
const dbUtils = require('../utils/database-utils');

const refreshToken = async (req, res) => {
  const user = req.authUser;

  try {
    const response = await axios.post(
      'https://accounts.google.com/o/oauth2/token',
      {
        grant_type: 'refresh_token',
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: decodeURIComponent(user.refreshToken),
      }
    );

    const accessToken = response.data.access_token;

    await User.updateOne(
      { googleId: user.googleId },
      { $set: { accessToken: encryption.encryptText(accessToken) } }
    );

    res.status(200).send();
  } catch (error) {
    res.status(500).send({ error: 'There was a problem refreshing the token' });
  }
};

const isLoggedIn = (req, res) => {
  let loggedIn = false;
  let rootUpdatedAt = null;

  if (req.user && req.user.length) {
    loggedIn = true;
    rootUpdatedAt = req.user[0].rootUpdatedAt;
  }

  res.status(200).send({
    loggedIn,
    rootUpdatedAt,
  });
};

const notifyClientActive = async (req, res) => {
  try {
    const googleId = req.authUser.googleId;

    await User.findOneAndUpdate({ googleId }, [
      { $set: { notifyFlag: { $eq: [false, '$notifyFlag'] } } },
    ]);

    res.status(200).send();
  } catch (error) {
    res.status(500).send({ error: 'There was a problem notifying the server' });
  }
};

const revokeAccess = async (accessToken) => {
  try {
    await axios.get('https://accounts.google.com/o/oauth2/revoke', {
      params: {
        token: accessToken,
      },
    });
  } catch (error) {
    return error;
  }

  return null;
};

const logout = async (req, res) => {
  const authUser = req.authUser;

  try {
    dbUtils.deleteAllChapterProgress(authUser.googleId);
    await revokeAccess(authUser.accessToken);
    await User.deleteOne({ googleId: authUser.googleId });
  } catch (error) {
    if (error.response.status !== 400) {
      res
        .status(error.response.status)
        .send({ error: 'There was a problem logging out' });
    }
  }

  await req.logout();

  req.session.destroy((err) => {
    if (!err) {
      res.status(200).clearCookie('connect.sid').send();
    } else {
      res.status(500).send();
    }
  });
};

module.exports = {
  refreshToken,
  isLoggedIn,
  notifyClientActive,
  logout,
};
