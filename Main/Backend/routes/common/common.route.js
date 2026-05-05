const express = require("express");
const router = express.Router();
const {getUserProfile} = require("../../controllers/common/common.controller");
const {verifyjwt} = require("../../Middleware/auth.middleware");
router.get("/profile" , verifyjwt , getUserProfile);
module.exports = router; 