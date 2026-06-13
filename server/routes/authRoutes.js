const express = require("express");
const { testLogin } = require("../controllers/authController");

const router = express.Router();

router.post("/test-login", testLogin);

module.exports = router;
