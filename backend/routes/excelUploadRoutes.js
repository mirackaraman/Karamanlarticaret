const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

// Multer konfigürasyonu (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Excel Yükleme Route
router.post('/products', protect, admin, upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const products = xlsx.utils.sheet_to_json(sheet);

    const createdProducts = await Product.insertMany(products);
    res.status(201).json({ message: 'Ürünler başarıyla yüklendi', createdProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Dosya işlenemedi' });
  }
});

module.exports = router;
