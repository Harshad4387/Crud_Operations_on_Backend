const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const verifyjwt = async (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

 
    const token = authHeader.split(" ")[1];
    
    
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    
    const user = await User.findById(decoded.userid).select("-password");
   
    if (!user) {
      return res.status(402).json({ message: "User not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Error in verifyjwt middleware:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please login again" });
    }

    return res.status(500).json({ message: "Internal server error" } );
  }
};

module.exports = { verifyjwt };
