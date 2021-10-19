const express = require("express");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoDBStore = require("connect-mongodb-session")(session);
const authRoute = require("./routes/auth.js");
const cors = require("cors");
require("./passport-config");

const app = express();

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

const sessionStore = new MongoDBStore({
	uri: process.env.MONGO_URI,
});

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		rolling: true,
		cookie: { maxAge: 1000 * 3600 * 24 * 30 }, // 1 month
		store: sessionStore,
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);

app.listen(5000, () => console.log(`Server listening on port ${5000}`));
