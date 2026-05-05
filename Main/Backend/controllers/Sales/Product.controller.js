const ProductionRequest = require("../../models/Request");
const Product = require("../../models/Product.model");

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
const allCompleted = async (req, res) => {
  try {
    // ✅ Find all completed production requests
    const completedRequests = await ProductionRequest.find({ status: "completed" })
      .populate({ path: "product", select: "name quantity assemblyTime remarks" })
      .populate({ path: "requestedBy", select: "name email role" })
      .populate({ path: "assignedTo", select: "name email role" })
      .sort({ completedAt: -1 }); // latest completed first

    // ✅ If none found, respond gracefully
    if (!completedRequests || completedRequests.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No completed production requests found",
        totalRequests: 0,
        data: [],
      });
    }

    // ✅ Format data for frontend
    const formattedData = completedRequests.map((reqDoc) => ({
      id: reqDoc._id,
      product: reqDoc.product ? reqDoc.product.name : "N/A",
      productDetails: reqDoc.product || null,
      quantity: reqDoc.quantity,
      requestedBy: reqDoc.requestedBy ? reqDoc.requestedBy.name : "Unknown",
      assignedTo: reqDoc.assignedTo ? reqDoc.assignedTo.name : "Unassigned",
      status: reqDoc.status,
      createdAt: reqDoc.createdAt,
      startedAt: reqDoc.startedAt,
      completedAt: reqDoc.completedAt,
      remarks: reqDoc.remarks || "",
    }));

    // ✅ Send response
    res.status(200).json({
      success: true,
      message: "All completed production requests fetched successfully",
      totalRequests: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error fetching completed requests:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching completed production requests",
      error: error.message,
    });
  }
};

const received = async (req, res) => {
  try {
    const { requestId } = req.body;

  
    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }

  
    const request = await ProductionRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Production request not found",
      });
    }

    if (request.status === "received") {
      return res.status(400).json({
        success: false,
        message: "Request already marked as received",
      });
    }

    if (request.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Only completed requests can be marked as received",
      });
    }

   
    const product = await Product.findById(request.product);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Related product not found",
      });
    }

 
    product.quantity += request.quantity;
    await product.save();

 
    request.status = "received";
    await request.save();

   
    res.status(200).json({
      success: true,
      message: "Production request marked as received and product quantity updated successfully",
      data: {
        requestId: request._id,
        productId: product._id,
        productName: product.name,
        newQuantity: product.quantity,
        status: request.status,
      },
    });
  } catch (error) {
    console.error("Error updating request to received:", error);
    res.status(500).json({
      success: false,
      message: "Server error while marking request as received",
      error: error.message,
    });
  }
};
module.exports = { getAllProducts ,allCompleted,received};
