var CryptoJS = require("crypto-js");

function encryptText(text) {
	return CryptoJS.AES.encrypt(text, process.env.ENCRYPTION_KEY).toString();
}

function decryptText(ciphertext) {
	return CryptoJS.AES.decrypt(ciphertext, process.env.ENCRYPTION_KEY).toString(
		CryptoJS.enc.Utf8
	);
}

module.exports = {
	encryptText,
	decryptText,
};
