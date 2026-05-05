const express = require("express");
const router = express.Router();
const {getAllRawMaterials,getAllProducts , getAllProductionWorkers} = require("../../controllers/Admin/admin.controller");
const {verifyjwt} = require("../../Middleware/auth.middleware");
router.get("/get-all-raw-material" , verifyjwt , getAllRawMaterials);
router.get("/get-all-products", verifyjwt ,getAllProducts );
router.get("/get-production-workers" , verifyjwt ,getAllProductionWorkers);

module.exports = router;