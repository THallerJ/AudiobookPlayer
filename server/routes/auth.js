const express = require("express");
const passport = require("passport");
var router = express.Router();

router.get("/failed", (req, res) => {
	res.send("<h1>Log in Failed :(</h1>");
});

const checkUserLoggedIn = (req, res, next) => {
	req.user ? next() : res.sendStatus(401);
};

router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "https://www.googleapis.com/auth/drive.readonly"],
		accessType: "offline",
	})
);

router.get(
	"/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/failed",
	}),
	(req, res) => {
		res.redirect("http://localhost:3000/");
	}
);

router.get("/isLoggedIn", (req, res) => {
	console.log(req.session);
	req.user ? res.send({ result: true }) : res.send({ result: false });
});

router.get("/logout", (req, res) => {
	console.log(req.user);
	res.send("hello");
	//req.session = null;
	//req.logout();
	//res.redirect("/");
});

module.exports = router;
