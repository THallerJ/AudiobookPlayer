const express = require("express");
const router = express.Router();
require("dotenv").config();
const generalController = require("../controllers/generalController");

router.get("/serverUrl", generalController.getServerUrl);

module.exports = router;
