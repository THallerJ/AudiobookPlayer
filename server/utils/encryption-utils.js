const CryptoJS = require("crypto-js");

const encryptText = (text) => {
	return CryptoJS.AES.encrypt(text, process.env.ENCRYPTION_KEY).toString();
};

const decryptText = (ciphertext) => {
	return CryptoJS.AES.decrypt(ciphertext, process.env.ENCRYPTION_KEY).toString(
		CryptoJS.enc.Utf8
	);
};

module.exports = {
	encryptText,
	decryptText,
};
