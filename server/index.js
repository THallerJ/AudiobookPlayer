const express = require("express");
const passport = require("passport");
const session = require("express-session");
const dbUtils = require("./database-utils");
const authRoute = require("./routes/auth.js");
const googleRoute = require("./routes/google.js");
const cors = require("cors");
require("./passport-config");

const app = express();

dbUtils.createDb();

app.use(dbUtils.getSession());

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);

	next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);
app.use("/google", googleRoute);

app.listen(5000, () => console.log(`Server listening on port ${5000}`));
