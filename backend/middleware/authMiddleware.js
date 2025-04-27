const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Giriş yapılmış kullanıcı kontrolü
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🔥 Kullanıcıyı DB'den alalım
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "Kullanıcı bulunamadı" });
      }

      req.user = user; // token içeriği değil, doğrudan kullanıcı objesi
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Yetkisiz, token geçersiz" });
    }
  } else {
    res.status(401).json({ message: "Yetkisiz, token yok" });
  }
};

// Admin kontrolü
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Admin yetkisi gerekiyor" });
  }
};

module.exports = { protect, admin };
