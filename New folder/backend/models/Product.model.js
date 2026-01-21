const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    unique: true
  },

  quantity: { 
    type: Number, 
    required: true, 
    default: 0 
  },

  assemblyTime: { 
    type: Number, 
    required: true, 
    min: [0, "Assembly time must be positive"] 
  },

  totalComponents: { 
    type: Number 
  },

  remarks: { 
    type: String 
  },

  materials: [
    {
      rawMaterial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RawMaterial",
        required: true
      },
      quantityRequired: {
        type: Number,
        required: true
      }
    }
  ],

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
