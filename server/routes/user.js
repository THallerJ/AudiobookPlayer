const express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");

router.post("/setRootDirectory", userController.setRootDirectory);
router.post("/setChapterProgress", userController.setChapterProgress);
router.get("/getBooksProgress", userController.getBooksProgress);

module.exports = { userRoute: router };
