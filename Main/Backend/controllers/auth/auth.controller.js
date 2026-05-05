const User = require("../../models/user.model");
const bcrypt = require("bcryptjs");
const generatejwt = require("../../utils/generatetoken");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = await generatejwt(user._id, res);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const role = "sales";  
    
    if (!name ||  !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (name, role, email, password).",
      });
    }

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    
    const newUser = new User({
      name,
      role,
      email,
      password,
      profilePhoto: "",
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while registering user.",
    });
  }
};


module.exports = { loginUser  , registerUser};
