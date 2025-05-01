const mongoose = require("mongoose");

// 🎯 Önce Review (Yorum) Şeması
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Yorumu yapan kullanıcı
    name: { type: String, required: true },    // Kullanıcı adı
    rating: { type: Number, required: true },  // 1-5 arası puan
    comment: { type: String, required: true }, // Yorum metni
  },
  { timestamps: true }
);

// 🎯 Ürün Şeması
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    countInStock: { type: Number, required: true },
    sold: { type: Number, default: 0 },         // Satış adedi
    reviews: [reviewSchema],                    // Yorumlar listesi
    rating: { type: Number, default: 0 },        // Ortalama yıldız puanı
    numReviews: { type: Number, default: 0 },    // Yorum adedi
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
