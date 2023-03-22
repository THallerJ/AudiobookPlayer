const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/auth");

router.post(
	"/setRootDirectory",
	isAuthenticated,
	userController.setRootDirectory
);
router.post(
	"/setChapterProgress",
	isAuthenticated,
	userController.setChapterProgress
);
router.get(
	"/getBooksProgress",
	isAuthenticated,
	userController.getBooksProgress
);

module.exports = { userRoute: router };
