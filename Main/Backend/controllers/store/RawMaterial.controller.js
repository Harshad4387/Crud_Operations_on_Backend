const RawMaterial = require("../../models/RawMaterial.model");
const getAllRawMaterials = async (req, res) => {
  try {
    const materials = await RawMaterial.find().sort({ UniqueId: 1 });
    res.status(200).json({
      success: true,
      count: materials.length,
      data: materials,
    });
  } catch (error) {
    console.error("Error fetching raw materials:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching raw materials.",
    });
  }
};
const addRawMaterialusingpostman = async (req, res) => {
  try {
    const materials = req.body; 

    // ✅ Validate array
    if (!Array.isArray(materials) || materials.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide an array of raw materials",
      });
    }

    // ✅ Validate fields
    for (let i = 0; i < materials.length; i++) {
      const item = materials[i];
      if (!item.name) {
        return res.status(400).json({
          success: false,
          message: `Name is required for item at index ${i}`,
        });
      }
      if (item.UniqueId === undefined) {
        return res.status(400).json({
          success: false,
          message: `UniqueId is required for item '${item.name}'`,
        });
      }
    }

    
    const insertedMaterials = await RawMaterial.insertMany(materials);

    res.status(201).json({
      success: true,
      message: `${insertedMaterials.length} raw materials added successfully`,
      data: insertedMaterials,
    });
  } catch (error) {
    console.error("Error adding raw materials:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding raw materials",
      error: error.message,
    });
  }
};

const InwardRawMaterial = async (req, res) => {
  try {
    const { _id, name, addQuantity } = req.body;

   
    if ((!_id && !name) || addQuantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Either raw material ID or name, and quantity are required",
      });
    }

    if (addQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than zero",
      });
    }

    // 🔍 Find material by _id first, fallback to name
    let material = null;
    if (_id) {
      material = await RawMaterial.findById(_id);
    } else if (name) {
      material = await RawMaterial.findOne({ name });
    }

    if (!material) {
      return res.status(404).json({
        success: false,
        message: `Raw material '${name || _id}' not found in database`,
      });
    }

    // ➕ Increment the quantity
    material.quantity = (material.quantity || 0) + addQuantity;
    await material.save();

    return res.status(200).json({
      success: true,
      message: `Quantity of '${material.name}' updated successfully`,
      updatedMaterial: {
        id: material._id,
        name: material.name,
        category: material.category,
        updatedQuantity: material.quantity,
      },
    });
  } catch (error) {
    console.error("Error updating raw material quantity:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating quantity",
    });
  }
};






module.exports = {  getAllRawMaterials , InwardRawMaterial};