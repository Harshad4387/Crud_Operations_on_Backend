const ProductionRequest = require("../../models/Request");
//done
const PendingRequest = async (req, res) => {
  try {
    const pendingRequests = await ProductionRequest.find({ status: "pending" })
      .populate({ path: "product", select: "name" })
      .populate({ path: "requestedBy", select: "name" })
      .sort({ createdAt: -1 });

    if (!pendingRequests || pendingRequests.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No pending production requests found",
      });
    }

    // ✅ Include _id so frontend has a valid Mongo ObjectId
    const formattedData = pendingRequests.map((reqDoc) => ({
      _id: reqDoc._id, // ✅ add this
      product: reqDoc.product ? reqDoc.product.name : "N/A",
      quantity: reqDoc.quantity,
      remarks: reqDoc.remarks || "",
      requestedBy: reqDoc.requestedBy ? reqDoc.requestedBy.name : "Unknown",
    }));

    res.status(200).json({
      success: true,
      message: "Pending production requests fetched successfully",
      totalRequests: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching pending production requests",
      error: error.message,
    });
  }
};
//done
const acceptRequest = async (req, res) => {
  try {
    const requestId = req.body.requestId || req.body.id;
    const userId = req.user.id;
    console.log("Request ID received:", requestId);

    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }

    
    if (!/^[0-9a-fA-F]{24}$/.test(requestId)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Request ID format: ${requestId}`,
      });
    }

    const request = await ProductionRequest.findById(requestId)
      .populate({ path: "product", select: "name" })
      .populate({ path: "requestedBy", select: "name email role" });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Production request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot accept this request. Current status: '${request.status}'`,
      });
    }

    request.assignedTo = userId;
    request.status = "accepted";
    request.startedAt = new Date();

    await request.save();
    await request.populate({ path: "assignedTo", select: "name email role" });

    res.status(200).json({
      success: true,
      message: "Production request accepted successfully",
      data: {
        id: request._id,
        product: request.product ? request.product.name : "N/A",
        quantity: request.quantity,
        status: request.status,
        assignedTo: request.assignedTo ? request.assignedTo.name : "Unknown",
        requestedBy: request.requestedBy ? request.requestedBy.name : "Unknown",
        startedAt: request.startedAt,
      },
    });
  } catch (error) {
    console.error("Error accepting production request:", error);
    res.status(500).json({
      success: false,
      message: "Server error while accepting production request",
      error: error.message,
    });
  }
};
//done
const getALLacceptedByWoker = async (req, res) => {
  try {
    const userId = req.user.id; 

    
    const acceptedRequests = await ProductionRequest.find({
      assignedTo: userId,
      status: "accepted",
    })
      .populate({ path: "product", select: "name" })
      .populate({ path: "requestedBy", select: "name email" })
      .sort({ startedAt: -1 });

    if (!acceptedRequests || acceptedRequests.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No accepted production requests found for this user",
      });
    }

    // ✅ Simplified response
    const formattedData = acceptedRequests.map((reqDoc) => ({
      id: reqDoc._id,
      product: reqDoc.product ? reqDoc.product.name : "N/A",
      quantity: reqDoc.quantity,
      remarks: reqDoc.remarks || "",
      requestedBy: reqDoc.requestedBy ? reqDoc.requestedBy.name : "Unknown",
      status: reqDoc.status,
      startedAt: reqDoc.startedAt,
    }));

    res.status(200).json({
      success: true,
      message: "Accepted production requests fetched successfully",
      totalRequests: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error fetching accepted requests:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching accepted requests",
      error: error.message,
    });
  }
};
const MyWork = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Extract user ID from verified JWT

    // ✅ Find all in-progress requests assigned to this user
    const inProgressRequests = await ProductionRequest.find({
      assignedTo: userId,
      status: "materials_collected",
    })
      .populate({ path: "product", select: "name quantity assemblyTime remarks" })
      .populate({ path: "requestedBy", select: "name email" })
      .sort({ startedAt: -1 }); // latest work first

    // ✅ No work found
    if (!inProgressRequests || inProgressRequests.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No in-progress work found for this user",
      });
    }

    // ✅ Format the response
    const formattedData = inProgressRequests.map((reqDoc) => ({
      id: reqDoc._id,
      product: reqDoc.product ? reqDoc.product.name : "N/A",
      quantity: reqDoc.quantity,
      remarks: reqDoc.remarks || "",
      requestedBy: reqDoc.requestedBy ? reqDoc.requestedBy.name : "Unknown",
      status: reqDoc.status,
      startedAt: reqDoc.startedAt,
      updatedAt: reqDoc.updatedAt,
    }));

    // ✅ Send response
    res.status(200).json({
      success: true,
      message: "In-progress work fetched successfully",
      totalRequests: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error fetching in-progress work:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching in-progress work",
      error: error.message,
    });
  }
};
const completed = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Logged-in worker
    const { requestId } = req.body; // ✅ Request ID from frontend

    // Validate request ID
    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }

    // Find the production request assigned to this user
    const request = await ProductionRequest.findOne({
      _id: requestId,
      assignedTo: userId,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Production request not found or not assigned to you",
      });
    }

    // Update status and completion time
    request.status = "completed";
    request.completedAt = new Date();
    await request.save();

    res.status(200).json({
      success: true,
      message: "Production request marked as completed successfully",
      data: {
        id: request._id,
        product: request.product,
        status: request.status,
        completedAt: request.completedAt,
      },
    });
  } catch (error) {
    console.error("Error marking request as completed:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating request status",
      error: error.message,
    });
  }
};

const allCompletedWork = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Logged-in user's ID from JWT

    // ✅ Find only completed requests assigned to this user
    const completedRequests = await ProductionRequest.find({
      assignedTo: userId,
      status: "completed",
    })
      .populate({ path: "product", select: "name quantity assemblyTime remarks" })
      .populate({ path: "requestedBy", select: "name email role" })
      .populate({ path: "assignedTo", select: "name email role" })
      .sort({ completedAt: -1 }); // latest completed first

    // ✅ Handle empty result gracefully
    if (!completedRequests || completedRequests.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No completed production requests found for this user",
        totalRequests: 0,
        data: [],
      });
    }

    // ✅ Format data for frontend
    const formattedData = completedRequests.map((reqDoc) => ({
      id: reqDoc._id,
      product: reqDoc.product ? reqDoc.product.name : "N/A",
      quantity: reqDoc.quantity,
      requestedBy: reqDoc.requestedBy ? reqDoc.requestedBy.name : "Unknown",
      assignedTo: reqDoc.assignedTo ? reqDoc.assignedTo.name : "Unassigned",
      status: reqDoc.status,
      createdAt: reqDoc.createdAt,
      startedAt: reqDoc.startedAt,
      completedAt: reqDoc.completedAt,
      remarks: reqDoc.remarks || "",
    }));

    // ✅ Send successful response
    res.status(200).json({
      success: true,
      message: "Completed production requests fetched successfully for this user",
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



 

module.exports = { PendingRequest  , acceptRequest,getALLacceptedByWoker,MyWork ,completed , allCompletedWork};

