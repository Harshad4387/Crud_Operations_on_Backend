const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ["admin", "sales", "store", "productionworker"],
      required: true
    },
    profilePhoto: {
      type: String,
      default: ""
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    badges: {
      type: Number,
      default: 0,
      select:false
    }
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


const User = mongoose.model("User", userSchema);
module.exports = User;
