function getHostname(req, res) {
	res.send(req.hostname);
}

module.exports = {
	getHostname,
};
