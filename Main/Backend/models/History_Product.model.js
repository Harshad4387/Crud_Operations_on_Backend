const mongoose = require("mongoose");

const productHistorySchema = new mongoose.Schema({
  // 🔗 Reference to your existing Product
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  // 🕒 When update happened
  updatedAt: {
    type: Date,
    default: Date.now
  },

  // 🔢 Count of fields changed
  updatedFieldsCount: {
    type: Number,
    required: true
  },

  // 📌 Which fields changed
  updatedFields: [
    {
      type: String
    }
  ],

  
  oldValues: {
    type: Object
  },


  newValues: {
    type: Object
  },


  updatedBy: {
    type: String
  }

});

const ProductHistory = mongoose.model("ProductHistory", productHistorySchema);

module.exports = ProductHistory;