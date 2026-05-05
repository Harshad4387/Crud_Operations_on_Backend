
const Product = require("../../models/Product.model");
const ProductHistory = require("../../models/History_Product.model");

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
const getHistoryofProduct = async (req, res) => {
  try {
    const { id } = req.params; 

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // 🔍 Fetch history for this product
    const history = await ProductHistory.find({ productId: id })
      .sort({ updatedAt: -1 }); // latest first

    if (!history || history.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No history found for this product",
        totalRecords: 0,
        data: [],
      });
    }

    // 🧠 Optional: Format for frontend
    const formattedData = history.map((item) => ({
      id: item._id,
      productId: item.productId,
      updatedAt: item.updatedAt,
      updatedFields: item.updatedFields,
      updatedFieldsCount: item.updatedFieldsCount,
      oldValues: item.oldValues,
      newValues: item.newValues,
      updatedBy: item.updatedBy || "system",
    }));

    res.status(200).json({
      success: true,
      message: "Product history fetched successfully",
      totalRecords: formattedData.length,
      data: formattedData,
    });

  } catch (error) {
    console.error("Error fetching product history:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product history",
      error: error.message,
    });
  }
};

module.exports = { getAllProducts , getHistoryofProduct };
