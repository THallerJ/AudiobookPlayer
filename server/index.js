const express = require("express");
const passport = require("passport");
const dbConfig = require("./config/database-config");
const authRoute = require("./routes/auth.js");
const googleRoute = require("./routes/google.js");
const { userRoute } = require("./routes/user.js");
const generalRoute = require("./routes/general.js");
const cors = require("cors");
require("./config/passport-config");
const authMiddleware = require("./middleware/auth");
const path = require("path");
const expressStaticGzip = require("express-static-gzip");

const app = express();

dbConfig.createDb();

app.use("/", expressStaticGzip(path.join(__dirname, "/../client", "dist")));

app.use(dbConfig.getSession());
app.use(express.json());

app.use(
	cors({
		credentials: true,
		origin: process.env.SERVER_URL,
	})
);

app.use(function (req, res, next) {
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);

	next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);
app.use("/google", authMiddleware.isAuthenticated, googleRoute);
app.use("/user", authMiddleware.isAuthenticated, userRoute);
app.use("/general", generalRoute);

app.listen(process.env.PORT || 5000);
