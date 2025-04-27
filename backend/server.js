const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const uploadRoutes = require("./routes/uploadRoutes");
const { protect, admin } = require("./middleware/authMiddleware"); // ✅
const feedbackRoutes = require("./routes/feedbackRoutes");
const excelUploadRoutes = require("./routes/excelUploadRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes")); // ✅ düzelttik
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/upload", uploadRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use('/api/uploadexcel', excelUploadRoutes);

app.get("/api/admin", protect, admin, (req, res) => {
  res.json({ message: "Admin Paneli" });
});

app.get("/", (req, res) => {
  res.send("✅ Backend API çalışıyor!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Sunucu çalışıyor: http://localhost:${PORT}`);
});
