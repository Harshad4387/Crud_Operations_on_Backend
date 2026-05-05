const Product = require("../models/Product.model");
const RawMaterial = require("../models/RawMaterial.model");

// CREATE / ADD PRODUCT
const addProduct = async (req, res) => {
  try {
    const { name, quantity, assemblyTime, totalComponents, remarks, materials } = req.body;

    // Basic validation
    if (!name || !quantity || !assemblyTime) {
      return res.status(400).json({
        success: false,
        message: "Name, quantity, and assemblyTime are required"
      });
    }

    // Optional: Validate raw materials exist
    if (materials && materials.length > 0) {
      for (let mat of materials) {
        const exists = await RawMaterial.findById(mat.rawMaterial);
        if (!exists) {
          return res.status(400).json({
            success: false,
            message: `Raw material with ID ${mat.rawMaterial} not found`
          });
        }
      }
    }

    const product = new Product({
      name,
      quantity,
      assemblyTime,
      totalComponents,
      remarks,
      materials // should be array of { rawMaterial: id, quantityRequired: number }
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product
    });

  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("materials.rawMaterial") // populate raw material details
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, assemblyTime, totalComponents, remarks, materials } = req.body;

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Validate raw materials if provided
    if (materials && materials.length > 0) {
      for (let mat of materials) {
        const exists = await RawMaterial.findById(mat.rawMaterial);
        if (!exists) {
          return res.status(400).json({
            success: false,
            message: `Raw material with ID ${mat.rawMaterial} not found`
          });
        }
      }
    }

    // Update fields
    product.name = name ?? product.name;
    product.quantity = quantity ?? product.quantity;
    product.assemblyTime = assemblyTime ?? product.assemblyTime;
    product.totalComponents = totalComponents ?? product.totalComponents;
    product.remarks = remarks ?? product.remarks;
    product.materials = materials ?? product.materials;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });

  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


module.exports = {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
};
