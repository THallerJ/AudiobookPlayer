const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

// setup session store
const sessionStore = new MongoDBStore({
	uri: process.env.MONGO_URI,
	collection: "users",
});

const session = session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	store: sessionStore,
	autoRemove: "interval",
});
