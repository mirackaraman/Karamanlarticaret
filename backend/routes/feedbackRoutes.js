const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const { protect, admin } = require("../middleware/authMiddleware");

// Kullanıcı mesaj gönderebilir
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Tüm alanlar zorunlu" });
  }

  const feedback = new Feedback({ name, email, message });
  await feedback.save();

  res.status(201).json({ message: "Geri bildiriminiz alındı. Teşekkürler!" });
});

// Admin tüm mesajları görebilir
router.get("/", protect, admin, async (req, res) => {
  const feedbacks = await Feedback.find().sort({ createdAt: -1 });
  res.json(feedbacks);
});

// Admin mesaj silebilir
router.delete("/:id", protect, admin, async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);

  if (feedback) {
    await feedback.deleteOne();
    res.json({ message: "Mesaj silindi" });
  } else {
    res.status(404).json({ message: "Mesaj bulunamadı" });
  }
});

// ✅ Admin mesajı "okundu" olarak işaretleyebilir
router.put("/:id", protect, admin, async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);

  if (feedback) {
    feedback.isRead = true; // isRead alanını true yapıyoruz
    await feedback.save();
    res.json({ message: "Mesaj okundu olarak işaretlendi" });
  } else {
    res.status(404).json({ message: "Mesaj bulunamadı" });
  }
});

module.exports = router;
