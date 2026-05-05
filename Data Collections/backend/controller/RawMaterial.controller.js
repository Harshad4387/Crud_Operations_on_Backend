const RawMaterial = require("../models/RawMaterial.model");

// CREATE
const createRawMaterial = async (req, res) => {
  try {
    const { name, pieces, quantity, unit, supplier, remarks } = req.body;

    if (!name || !pieces || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Name, pieces and quantity are required"
      });
    }

    const rawMaterial = new RawMaterial({
      name,
      pieces,
      quantity,
      unit,
      supplier,
      remarks
    });

    await rawMaterial.save();

    return res.status(201).json({
      success: true,
      message: "Raw material added successfully",
      data: rawMaterial
    });

  } catch (error) {
    console.error("Error creating raw material:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// GET ALL
const getAllRawMaterials = async (req, res) => {
  try {
    const rawMaterials = await RawMaterial.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: rawMaterials.length,
      data: rawMaterials
    });

  } catch (error) {
    console.error("Error fetching raw materials:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// UPDATE
const updateRawMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, pieces, quantity, unit, supplier, remarks } = req.body;

    const updatedRawMaterial = await RawMaterial.findByIdAndUpdate(
      id,
      {
        name,
        pieces,
        quantity,
        unit,
        supplier,
        remarks
      },
      { new: true, runValidators: true }
    );

    if (!updatedRawMaterial) {
      return res.status(404).json({
        success: false,
        message: "Raw material not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Raw material updated successfully",
      data: updatedRawMaterial
    });

  } catch (error) {
    console.error("Error updating raw material:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// DELETE
const deleteRawMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRawMaterial = await RawMaterial.findByIdAndDelete(id);

    if (!deletedRawMaterial) {
      return res.status(404).json({
        success: false,
        message: "Raw material not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Raw material deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting raw material:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  createRawMaterial,
  getAllRawMaterials,
  updateRawMaterial,
  deleteRawMaterial
};
