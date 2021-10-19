const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	googleId: String,
	accessToken: String,
	RefreshToken: String,
});

module.exports = mongoose.model("User", userSchema);
