const express = require("express");
const router = express.Router();
const {getAllRawMaterials,InwardRawMaterial} = require("../../controllers/store/RawMaterial.controller");

const {verifyjwt} = require("../../Middleware/auth.middleware");

router.post("/inward", verifyjwt, InwardRawMaterial);
router.get("/getRawmaterial" , verifyjwt ,getAllRawMaterials );
module.exports = router;