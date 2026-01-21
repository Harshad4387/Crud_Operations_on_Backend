const express = require("express");
const router = express.Router();

const {
  createRawMaterial,
  getAllRawMaterials,
  updateRawMaterial,
  deleteRawMaterial
} = require("../controllers/rawMaterialController");


router.post("/add", createRawMaterial);


router.get("/get-all", getAllRawMaterials);


router.put("/update/:id", updateRawMaterial);


router.delete("/delete/:id", deleteRawMaterial);

module.exports = router;
