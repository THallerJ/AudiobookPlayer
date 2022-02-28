function isAuthenticated(req, res, next) {
	if (req.user && req.user.length) {
		req.authUser = req.user[0];
		return next();
	} else {
		res.status(403).send();
	}
}

module.exports = { isAuthenticated };
