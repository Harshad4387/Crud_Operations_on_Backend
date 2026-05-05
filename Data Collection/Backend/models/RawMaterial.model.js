const mongoose = require("mongoose");

const rawMaterialSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },

  pieces: { 
    type: Number, 
    required: true 
  },

  quantity: { 
    type: Number, 
    required: true 
  },

  unit: { 
    type: String   // enum removed
  },

  supplier: { 
    type: String 
  },

  remarks: { 
    type: String 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const RawMaterial = mongoose.model("RawMaterial", rawMaterialSchema);
module.exports = RawMaterial;
