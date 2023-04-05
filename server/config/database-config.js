const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();

let mySession;

const createDb = () => {
  mongoose.set('strictQuery', true);

  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // setup session store
  const sessionStore = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions',
  });

  mySession = session({
    sameSite: 'Lax',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 1000 * 3600 * 24 * 30 }, // 1 month
    store: sessionStore,
  });
};

const getSession = () => {
  return mySession;
};

module.exports = {
  createDb,
  getSession,
};
