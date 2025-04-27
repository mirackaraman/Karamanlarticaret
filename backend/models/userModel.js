const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Eğer daha önce "User" modeli tanımlandıysa tekrar tanımlamayı önler
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Burada userModel olarak export ediyoruz
module.exports = User;
