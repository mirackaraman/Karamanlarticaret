const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const User = require('../models/userModel');

// Kullanıcının kendi profilini getir
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

// ✅ Tüm kullanıcıları getir (sadece admin erişebilir)
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // şifreyi dahil etme
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Kullanıcılar alınamadı" });
  }
});

// Admin Yetkisi Ver/Kaldır (Sadece admin)
router.put("/:id/admin", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.isAdmin = !user.isAdmin;  // Admin yapma veya admin yetkisini kaldırma
      await user.save();
      res.status(200).json({ message: `Kullanıcı admin yetkisi ${user.isAdmin ? "verildi" : "kaldırıldı"}` });
    } else {
      res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
  } catch (err) {
    res.status(500).json({ message: "Hata oluştu" });
  }
});

// Kullanıcı Silme (Sadece admin)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      await user.remove();
      res.status(200).json({ message: "Kullanıcı silindi" });
    } else {
      res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
  } catch (err) {
    res.status(500).json({ message: "Kullanıcı silinirken hata oluştu" });
  }
});

module.exports = router;
