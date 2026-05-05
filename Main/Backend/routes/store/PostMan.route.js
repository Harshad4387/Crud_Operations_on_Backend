const express = require("express");
const router = express.Router();
const { addRawMaterialusingpostman , addProduct, addProductMaterial } = require("../../controllers/Postman.controller");

router.post("/add-material" , addRawMaterialusingpostman)
router.post("/addproduct", addProduct);
router.post("/add-product-and-material", addProductMaterial);

module.exports = router;
