const RawMaterial = require("../../models/RawMaterial.model");
const Product = require("../../models/Product.model");

const getInStockRawMaterialsByCategory = async (req, res) => {
  try {
    const materials = await RawMaterial.aggregate([
      { $match: { quantity: { $gt: 0 } } },  // Only in-stock materials
      { 
        $group: {
          _id: "$category",
          materials: { 
            $push: {
              name: "$name",
              quantity: "$quantity",
              unit: "$unit",
              supplier: "$supplier",
              remarks: "$remarks"
            }
          },
          totalInCategory: { $sum: "$quantity" }
        }
      },
      { $sort: { _id: 1 } } // Sort by category name
    ]);

    res.status(200).json({
      success: true,
      totalCategories: materials.length,
      data: materials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching raw materials grouped by category",
      error: error.message
    });
  }
};

const getrawmaterial = async (req, res) => {
  try {

    const rawMaterials = await RawMaterial.find({}, { name: 1, _id: 0 }).sort({ name: 1 });

    if (!rawMaterials || rawMaterials.length === 0) {
      return res.status(404).json({ message: "No raw materials found." });
    }

    const names = rawMaterials.map(rm => rm.name);

    res.status(200).json({ success: true, data: names });
  } catch (error) {
    console.error("Error fetching raw materials:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
const getproductsnames = async (req, res) => {
  try {
   
    const products = await Product.find({}, { name: 1, _id: 0 }).sort({ name: 1 });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found." });
    }

  
    const productNames = products.map(p => p.name);

    res.status(200).json({
      success: true,
      data: productNames,
    });
  } catch (error) {
    console.error("Error fetching product names:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product names.",
      error: error.message,
    });
  }
};
module.exports = {
  getInStockRawMaterialsByCategory,
  getrawmaterial,
  getproductsnames
};
