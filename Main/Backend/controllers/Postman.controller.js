const RawMaterial = require("../models/RawMaterial.model");
const Product = require("../models/Product.model");
const ProductMaterial = require("../models/ProductComponent.model");

const addRawMaterialusingpostman = async (req, res) => {
  try {
    let materials = req.body;

    console.log("Total received:", materials.length);

    if (!Array.isArray(materials) || materials.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide an array of raw materials",
      });
    }

    // CLEAN + VALIDATE FIELDS
    materials = materials.map((item, index) => {
      if (!item.name) {
        console.log(`❌ Missing name at index ${index}:`, item);
        throw new Error(`Name is required for item at index ${index}`);
      }
      if (item.UniqueId === undefined) {
        console.log(`❌ Missing UniqueId at index ${index}:`, item);
        throw new Error(`UniqueId is required for item '${item.name}'`);
      }

      return {
        name: item.name.trim(),
        UniqueId: Number(item.UniqueId),
        Pieces: Number(item.Pieces),
        quantity: Number(item.quantity) || 0,
        unit: item.unit?.trim() || "-",
        supplier: item.supplier?.trim() || "",
        remarks: item.remarks?.trim() || ""
      };
    });

    try {
      const insertedMaterials = await RawMaterial.insertMany(materials, {
        ordered: false,
      });

      return res.status(201).json({
        success: true,
        message: `${insertedMaterials.length} raw materials added successfully`,
        data: insertedMaterials,
      });

    } catch (insertError) {
      const errors = [];

      // For duplicate or MongoDB-level write errors
      if (insertError.writeErrors) {
        insertError.writeErrors.forEach((err) => {
          const doc = err.err.op || {};

          console.log("❌ FAILED TO INSERT:", doc);
          console.error("🔍 ERROR:", err.err.message || err.err.errmsg);

          errors.push({
            UniqueId: doc.UniqueId,
            name: doc.name,
            reason: err.err.message || err.err.errmsg,
          });
        });
      }

      // For Mongoose validation errors (CastError, required, etc.)
      if (insertError.name === "ValidationError") {
        console.log("❌ Validation error:", insertError.message);
        errors.push({ reason: insertError.message });
      }

      return res.status(400).json({
        success: false,
        message: "Some raw materials failed validation",
        errors,
      });
    }

  } catch (error) {
    console.error("Server error while adding raw materials:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding raw materials",
      error: error.message,
    });
  }
};




const addProduct = async (req, res) => {
  try {
    const { productId, name, assemblyTime, totalComponents, remarks } = req.body;

    if (!productId || !name || !assemblyTime) {
      return res.status(400).json({
        success: false,
        message: "'productId', 'name', and 'assemblyTime' are required"
      });
    }

    const newProduct = new Product({
      productId,
      name,
      assemblyTime,
      totalComponents: totalComponents || 0,
      remarks: remarks || ""
    });

    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newProduct
    });

  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding product",
      error: error.message
    });
  }
};




const addProductMaterial = async (req, res) => {
  try {
    const { product: productName, materials } = req.body;


    if (!productName) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }
    if (!materials || !Array.isArray(materials) || materials.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Materials array is required",
      });
    }


    for (let i = 0; i < materials.length; i++) {
      const { uniqueId, quantity } = materials[i];
      if (uniqueId === undefined || quantity === undefined) {
        return res.status(400).json({
          success: false,
          message: `Missing 'uniqueId' or 'quantity' at index ${i}`,
        });
      }
    }

  
    const productDoc = await Product.findOne({ name: productName });
    if (!productDoc) {
      return res.status(404).json({
        success: false,
        message: `Product '${productName}' not found`,
      });
    }

    const materialsWithIds = [];

    for (let m of materials) {
     
      if (m.uniqueId === 0) {
        console.log(`⏭️ Ignored material with UniqueId 0: ${m.rawMaterial}`);
        continue;
      }

      const rawMaterialDoc = await RawMaterial.findOne({ UniqueId: m.uniqueId });
      if (!rawMaterialDoc) {
        return res.status(404).json({
          success: false,
          message: `Raw material with UniqueId '${m.uniqueId}' not found`,
        });
      }

      // ✅ Push even if quantity is negative
      materialsWithIds.push({
        rawMaterial: rawMaterialDoc._id,
        quantity: m.quantity, // keep as-is (can be negative)
      });
    }

    // ✅ Check if any valid materials remain
    if (materialsWithIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid materials to add (all had UniqueId 0)",
      });
    }

   
    const newProductMaterial = new ProductMaterial({
      product: productDoc._id,
      materials: materialsWithIds,
    });

    await newProductMaterial.save();

    
    await newProductMaterial.populate([
      { path: "product", select: "name quantity assemblyTime" },
      { path: "materials.rawMaterial", select: "name UniqueId category unit" },
    ]);

    res.status(201).json({
      success: true,
      message: "Product materials linked successfully",
      data: newProductMaterial,
    });
  } catch (error) {
    console.error("Error adding product material:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding product material",
      error: error.message,
    });
  }
};



const addonebyone = async (req, res) => {
  try {
    const item = req.body;

    // BASIC VALIDATION
    if (!item || !item.UniqueId || !item.name || !item.Pieces) {
      return res.status(400).json({
        success: false,
        message: "UniqueId, name, and Pieces are required fields"
      });
    }

    // CLEAN INPUT
    const cleanItem = {
      name: item.name.trim(),
      UniqueId: Number(item.UniqueId),
      Pieces: Number(item.Pieces),
      category: item.category?.trim() || "OTHERS",
      quantity: Number(item.quantity) || 0,
      unit: item.unit?.trim() || "-",
      supplier: item.supplier?.trim() || "",
      remarks: item.remarks?.trim() || ""
    };

    // UPSERT (insert if not exist → update if exist)
    const saved = await RawMaterial.findOneAndUpdate(
      { UniqueId: cleanItem.UniqueId },  // filter
      { $set: cleanItem },               // update values
      { upsert: true, new: true }        // create if not exists
    );

    return res.status(200).json({
      success: true,
      message: "Raw material inserted/updated successfully",
      data: saved
    });

  } catch (error) {
    console.error("Error inserting raw material:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while inserting raw material",
      error: error.message
    });
  }
};



module.exports = { addRawMaterialusingpostman , addProduct , addProductMaterial };
