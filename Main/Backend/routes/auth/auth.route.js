const express = require("express");
const router = express.Router();
const { loginUser ,registerUser } = require("../../controllers/auth/auth.controller");
// const User = require('../../models/user.model');

router.post("/login", loginUser);
router.post("/register" ,registerUser);

module.exports = router;
