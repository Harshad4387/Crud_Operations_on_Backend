const mongoose = require("mongoose");

const rawMaterialSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  UniqueId : {type : Number , required : true },
  Pieces : {
    type : Number ,
    required : true 
  },

  quantity: { type: Number }, 
  unit: { 
    type: String, 
    enum: [
      "PCS", //NO
      "BOX", 
      "MTR",
      "SET",//PKT
      "CHART"//CHAT // Sticker
    ], 
    default: ""
  },
  supplier: {
    type : String,
    
  },
  remarks: { type: String }
});

const RawMaterial = mongoose.model("RawMaterial", rawMaterialSchema);
module.exports = RawMaterial;
