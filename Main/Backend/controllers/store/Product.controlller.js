// controllers/productController.js
const Product = require("../../models/Product.model");

// ✅ Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(490).json({
        success: true,
        message: "No products found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
};

module.exports = { getAllProducts };
