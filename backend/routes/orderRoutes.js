const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");

// ✅ Sipariş oluştur (korumalı)
router.post("/", protect, async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "Sipariş öğeleri boş olamaz" });
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// ✅ Giriş yapan kullanıcının kendi siparişlerini getir
router.get("/myorders", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// ✅ Tüm siparişleri getir + filtreleme opsiyonu (sadece admin)
router.get("/", protect, admin, async (req, res) => {
  const { status, keyword } = req.query;
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (keyword) {
    filter.$or = [
      { _id: { $regex: keyword, $options: "i" } },
      // kullanıcı adı filtrelemesi aggregate ile yapılabilir (ileride)
    ];
  }

  const orders = await Order.find(filter).populate("user", "name email");
  res.json(orders);
});

// ✅ Tek siparişi getir (admin veya kendi siparişi)
router.get("/:id", protect, async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (order) {
    if (req.user.isAdmin || order.user._id.equals(req.user._id)) {
      res.json(order);
    } else {
      res.status(403).json({ message: "Bu siparişi görmeye yetkin yok" });
    }
  } else {
    res.status(404).json({ message: "Sipariş bulunamadı" });
  }
});

// ✅ Siparişi "ödendi" olarak işaretle
router.put("/:id/pay", protect, async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Sipariş bulunamadı" });
  }
});

// ✅ Sipariş durumunu güncelle (admin)
router.put("/:id/status", protect, admin, async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status || order.status;

    if (req.body.isDelivered === true) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Sipariş bulunamadı" });
  }
});

// ✅ Siparişi "teslim edildi" olarak işaretle (admin)
router.put("/:id/deliver", protect, admin, async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Sipariş bulunamadı" });
  }
});

// ✅ Günlük satış ve sipariş istatistikleri (admin dashboard için)
router.get("/stats/daily", protect, admin, async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "İstatistik verisi alınamadı" });
  }
});

// ✅ Bugünkü satış ve sipariş verisi (satış hedefi için)
router.get("/stats/today", protect, admin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    res.json(result[0] || { totalSales: 0, totalOrders: 0 });
  } catch (err) {
    res.status(500).json({ message: "Bugünkü satış verisi alınamadı" });
  }
});

// ✅ En çok satan ürünler
router.get("/stats/top-products", protect, admin, async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.name",
          totalSold: { $sum: "$orderItems.qty" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    res.json(topProducts);
  } catch (err) {
    res.status(500).json({ message: "Top ürünler alınamadı" });
  }
});

module.exports = router;
