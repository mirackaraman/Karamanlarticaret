const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDB");
const Product = require("./models/Product");
const products = require("./data/products");

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Product.deleteMany(); // eski ürünleri temizle
    await Product.insertMany(products); // yenilerini ekle
    console.log("✅ Ürünler başarıyla eklendi!");
    process.exit(); // işlem bitince çık
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
};

importData();
