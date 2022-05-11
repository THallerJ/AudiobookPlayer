function getServerUrl(req, res) {
	if (req.hostname === "localhost") {
		res.send("http://localhost:5000");
	} else {
		res.send(`https://https${req.hostname}`);
	}
}

module.exports = {
	getServerUrl,
};
