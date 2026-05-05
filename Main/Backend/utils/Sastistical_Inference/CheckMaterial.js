const ProductMaterial = require("../../models/ProductComponent.model");

/**
 * Check if required raw materials are available.
 * Ignores materials with quantity = -1 (unlimited).
 */
const checkMaterialAvailability = async (productId, requestedQuantity) => {
  try {
    const productMaterials = await ProductMaterial.findOne({ product: productId }).populate(
      "materials.rawMaterial",
      "name quantity"
    );

    if (!productMaterials) {
      return {
        success: false,
        message: "No material mapping found for this product",
        isSufficient: false,
      };
    }

    for (const item of productMaterials.materials) {
      const material = item.rawMaterial;
      const requiredPerUnit = item.quantity;

      if (!material || material.quantity === undefined || material.quantity === -1) continue;

      const available = material.quantity;
      const totalRequired = requiredPerUnit * requestedQuantity;

      if (available < totalRequired) {
        return {
          success: true,
          isSufficient: false,
          message: `Not enough stock for ${material.name}. Required: ${totalRequired}, Available: ${available}`,
        };
      }
    }

    return {
      success: true,
      isSufficient: true,
      message: "Sufficient raw materials available",
    };
  } catch (error) {
    console.error("Error checking material availability:", error);
    return {
      success: false,
      isSufficient: false,
      message: "Server error while checking material availability",
      error: error.message,
    };
  }
};

module.exports = { checkMaterialAvailability };
