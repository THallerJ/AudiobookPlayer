const express = require("express");
var router = express.Router();
require("dotenv").config();
const generalController = require("../controllers/generalController");

router.get("/serverUrl", generalController.getServerUrl);

module.exports = router;
