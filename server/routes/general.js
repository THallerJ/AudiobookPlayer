const express = require("express");
var router = express.Router();
require("dotenv").config();
const generalController = require("../controllers/generalController");

router.get("/hostname", generalController.getHostname);

module.exports = router;
