const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

/* --------------------------------------------------------- */
// 📌 EN ÇOK SATAN ÜRÜNLER (Top 5)
router.get("/top", async (req, res) => {
  try {
    const topProducts = await Product.find().sort({ sold: -1 }).limit(5);
    res.json(topProducts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message || "Top ürünler alınamadı." });
  }
});

/* --------------------------------------------------------- */
// 📌 EXCEL veya CSV DOSYASINDAN TOPLU ÜRÜN YÜKLEME
router.post("/import", protect, admin, async (req, res) => {
  const { products } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).json({ message: "Ürün verisi bulunamadı." });
  }

  try {
    const formattedProducts = products.map((p) => ({
      name: p.name || "Ürün Adı",
      image: p.image || "/placeholder.jpg",
      brand: p.brand || "Marka",
      category: p.category || "Kategori",
      description: p.description || "Açıklama",
      price: p.price || 0,
      countInStock: p.countInStock || 0,
      discountPrice: p.discountPrice || 0,
      sold: 0,
    }));

    await Product.insertMany(formattedProducts);
    res.status(201).json({ message: `${formattedProducts.length} ürün başarıyla yüklendi.` });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message || "Toplu ürün yüklenemedi." });
  }
});

/* --------------------------------------------------------- */
// 📌 TÜM ÜRÜNLERİ GETİR
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message || "Ürünler alınamadı." });
  }
});

/* --------------------------------------------------------- */
// 📌 TEK ÜRÜN GETİR (ID İLE)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Ürün bulunamadı." });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Geçersiz ürün ID." });
  }
});

/* --------------------------------------------------------- */
// 📌 YENİ ÜRÜN OLUŞTUR (Admin)
router.post("/", protect, admin, async (req, res) => {
  const { name, image, brand, category, description, price, countInStock, discountPrice } = req.body;

  try {
    const product = new Product({
      name: name || "Yeni Ürün",
      image: image || "/images/default.jpg",
      brand: brand || "Marka",
      category: category || "Kategori",
      description: description || "Açıklama",
      price: price || 0,
      countInStock: countInStock || 0,
      discountPrice: discountPrice || 0,
      sold: 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message || "Ürün oluşturulamadı." });
  }
});

/* --------------------------------------------------------- */
// 📌 ÜRÜN GÜNCELLE (Admin)
router.put("/:id", protect, admin, async (req, res) => {
  const { name, image, brand, category, description, price, countInStock, discountPrice } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.image = image || product.image;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.description = description || product.description;
      product.price = price !== undefined ? price : product.price;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
      product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Ürün bulunamadı." });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message || "Ürün güncellenemedi." });
  }
});

/* --------------------------------------------------------- */
// 📌 ÜRÜN SİL (Admin)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Ürün başarıyla silindi." });
    } else {
      res.status(404).json({ message: "Ürün bulunamadı." });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message || "Ürün silinemedi." });
  }
});

/* --------------------------------------------------------- */
// 📌 ÜRÜNE YORUM EKLE (Giriş Yapmış Kullanıcılar)
router.post("/:id/reviews", protect, async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: "Bu ürüne zaten yorum yaptınız." });
      }

      const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Yorum başarıyla eklendi." });
    } else {
      res.status(404).json({ message: "Ürün bulunamadı." });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message || "Yorum eklenemedi." });
  }
});

/* --------------------------------------------------------- */

module.exports = router;
