// backend/routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback"); // ✅ Model gerekiyor
const { protect, admin } = require("../middleware/authMiddleware");

// ➡️ 1) Kullanıcı mesaj gönderecek (herkes erişebilir)
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const feedback = await Feedback.create({ name, email, message });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Mesaj gönderilemedi." });
  }
});

// ➡️ 2) Admin mesajları listeleyecek
router.get("/", protect, admin, async (req, res) => {
  const feedbacks = await Feedback.find().sort({ createdAt: -1 });
  res.json(feedbacks);
});

// ➡️ 3) Admin mesajı silebilecek
router.delete("/:id", protect, admin, async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);
  if (feedback) {
    await feedback.deleteOne();
    res.json({ message: "Mesaj silindi" });
  } else {
    res.status(404).json({ message: "Mesaj bulunamadı" });
  }
});

module.exports = router;
