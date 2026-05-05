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
  category : {
    type : String ,
     enum: [
    "Virat Fuse",
    "Contactor",
    "Connector",
    "Convertor Relay (Red Relay)",
    "Mobile Auto",
    "MK1 Relay (Black)",
    "MK2 Relay (DMC)",
    "MU Relay",
    "Virat Capacitor",
    "Shubh Capacitor",
    "Epcos Capacitor",
    "Box Capacitor",
    "Oil Capacitor",
    "Coil",
    "MCB",
    "Base",
    "8 MM Dol Starter",
    "10 MM Dol Starter",
    "MU DMC Starter",
    "Patti Kit",
    "Switch",
    "Meter",
    "Transformer",
    "Wire",
    "Wire Connector",
    "Ready Wire Set",
    "Blank PCB",
    "Assemble PCB",
    "Metal Body",
    "Screw",
    "Outer Box",
    "Electronic Components",
    "Ready Auto",
    "Ready Panel"
  ]
},
  
  remarks: { type: String }
});

const RawMaterial = mongoose.model("RawMaterial", rawMaterialSchema);
module.exports = RawMaterial;
