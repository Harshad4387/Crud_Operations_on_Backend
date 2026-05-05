const express = require("express");
const router = express.Router();
const { addProduct, getAllProducts ,updateProduct  ,deleteProduct} = require("../controller/Product.controller");

router.post("/add", addProduct);
router.get("/get-all", getAllProducts);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);


module.exports = router;
