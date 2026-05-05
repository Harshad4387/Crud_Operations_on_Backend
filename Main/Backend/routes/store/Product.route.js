const express = require("express");
const router = express.Router();
const {getAllProducts} = require("../../controllers/store/Product.controlller");
const {verifyjwt} = require("../../Middleware/auth.middleware");

router.get("/getProducts" ,verifyjwt ,getAllProducts );
module.exports = router; 