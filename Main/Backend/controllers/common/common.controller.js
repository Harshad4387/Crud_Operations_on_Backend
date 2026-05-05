const User = require("../../models/user.model");

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from verified token (middleware)

    const user = await User.findById(userId).select("-password -__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user profile",
      error: error.message,
    });
  }
};

module.exports = { getUserProfile };
