const ProductionRequest = require("../../models/Request");
const Product = require("../../models/Product.model");
const User = require("../../models/user.model");
// const {checkMaterialAvailability} = require("../../utils/Sastistical_Inference/CheckMaterial");

const createRequest = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    console.log(req.body);

    // ✅ Validate input
    if (!productId || !quantity) {
      return res.status(200).json({
        success: false,
        message: "Both 'productId' and 'quantity' are required",
      });
    }

    if (quantity <= 0) {
      return res.status(200).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    // ✅ Check if product exists
    const productDoc = await Product.findById(productId);
    if (!productDoc) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ✅ Get logged-in user
    const userId = req.user.id;
    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return res.status(404).json({
        success: false,
        message: "User not found or unauthorized",
      });
    }

    // ✅ Create new production request (no stock check)
    const newRequest = new ProductionRequest({
      product: productDoc._id,
      requestedBy: userDoc._id,
      quantity,
      status: "pending",
    });

    await newRequest.save();

    // ✅ Populate data for clean response
    await newRequest.populate([
      { path: "product", select: "name quantity assemblyTime" },
      { path: "requestedBy", select: "name email role" },
    ]);

    // ✅ Send response
    res.status(201).json({
      success: true,
      message: "Production request created successfully",
      data: newRequest,
    });

  } catch (error) {
    console.error("Error creating production request:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating production request",
      error: error.message,
    });
  }
};


const getAllRequests = async (req, res) => {
  try {
    
    const requests = await ProductionRequest.find()
      .populate({ path: "product", select: "name quantity assemblyTime remarks" })
      .populate({ path: "requestedBy", select: "name email role" })
      .populate({ path: "assignedTo", select: "name email role" })
      .sort({ createdAt: -1 }); 

    if (!requests || requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No production requests found",
      });
    }

    res.status(200).json({
      success: true,
      message: "All production requests fetched successfully",
      totalRequests: requests.length,
      data: requests.map((reqDoc) => ({
        id: reqDoc._id,
        product: reqDoc.product ? reqDoc.product.name : "N/A",
        productDetails: reqDoc.product || null,
        quantity: reqDoc.quantity,
        status: reqDoc.status,
        requestedBy: reqDoc.requestedBy ? reqDoc.requestedBy.name : "Unknown",
        assignedTo: reqDoc.assignedTo ? reqDoc.assignedTo.name : "Unassigned",
        createdAt: reqDoc.createdAt,
        updatedAt: reqDoc.updatedAt,   // ✅ Added updatedAt field
        startedAt: reqDoc.startedAt,
        completedAt: reqDoc.completedAt,
        remarks: reqDoc.remarks || "",
      })),
    });
  } catch (error) {
    console.error("Error fetching production requests:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching production requests",
      error: error.message,
    });
  }
};

const getAcceptedRequests = async (req, res) => {
  try {
    const acceptedRequests = await ProductionRequest.find({ status: "accepted" })
      .populate("product", "name")        
      .populate("requestedBy", "name")   
      .populate("assignedTo", "name")     
      .sort({ createdAt: -1 });          

    res.status(200).json({
      success: true,
      message: "Accepted production requests fetched successfully",
      data: acceptedRequests
    });
  } catch (error) {
    console.error("Error fetching accepted requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch accepted production requests",
      error: error.message
    });
  }
};

const collectedMaterial = async (req, res) => {
  try {
    const { requestId } = req.body;

    // Validate input
    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required"
      });
    }

    // Find and update the production request
    const updatedRequest = await ProductionRequest.findByIdAndUpdate(
      requestId,
      { status: "materials_collected", startedAt: new Date() },
      { new: true } // return updated document
    )
      .populate("product", "name")
      .populate("requestedBy", "name")
      .populate("assignedTo", "name");

    // If not found
    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Production request not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated to 'materials_collected' successfully",
      data: updatedRequest
    });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update request status",
      error: error.message
    });
  }
};

// const validateStockBeforeRequest = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;

//     if (!productId || !quantity) {
//       return res.status(400).json({
//         success: false,
//         message: "Both productId and quantity are required",
//       });
//     }

//     const stockCheck = await checkMaterialAvailability(productId, quantity);

//     if (!stockCheck.success) {
//       return res.status(500).json({
//         success: false,
//         message: stockCheck.message,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       isSufficient: stockCheck.isSufficient,
//       message: stockCheck.message,
//     });
//   } catch (error) {
//     console.error("Error validating material stock:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error validating material stock",
//       error: error.message,
//     });
//   }
// };





module.exports = { 
  createRequest ,
   getAllRequests,
    getAcceptedRequests,
    collectedMaterial,
    
   };
