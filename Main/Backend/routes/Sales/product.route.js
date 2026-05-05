const express = require("express");
const router = express.Router();
const {getAllProducts,allCompleted,received} = require("../../controllers/Sales/Product.controller");
const {verifyjwt} = require("../../Middleware/auth.middleware");

router.get("/getProducts" ,verifyjwt ,getAllProducts );
router.get("/get-Completed", verifyjwt , allCompleted);
router.post("/received" , verifyjwt , received);

module.exports = router; 