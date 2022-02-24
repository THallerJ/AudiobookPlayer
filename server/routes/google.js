const express = require("express");
var router = express.Router();
require("dotenv").config();
const googleController = require("../controllers/googleController");

router.get("/folders", googleController.folders);
router.get("/library", googleController.library);

module.exports = router;
