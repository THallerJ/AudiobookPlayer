const express = require("express");
var router = express.Router();
const playerController = require("../controllers/playerController");

router.post("/setRootDirectory", playerController.setRootDirectory);
router.post("/setChapterProgress", playerController.setChapterProgress);
router.get("/getBooksProgress", playerController.getBooksProgress);

module.exports = { playerRoute: router };
