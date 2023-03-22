const getServerUrl = (req, res) => {
	if (req.hostname === "localhost") {
		res.send("http://localhost:5000");
	} else {
		res.send(`https://${req.hostname}`);
	}
};

module.exports = {
	getServerUrl,
};
