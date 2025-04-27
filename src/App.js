import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import ThankYouPage from "./pages/ThankYouPage";
import TestPage from "./pages/TestPage";
import ProductList from "./pages/ProductList";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage"; // ✅ Ekledik
import PrivacyPage from "./pages/PrivacyPage"; // ✅ Ekledik

import AdminRoute from "./components/AdminRoute";
import AdminFeedbackPage from "./pages/AdminFeedbackPage";
import AdminProductPage from "./pages/AdminProductPage";
import AddProductPage from "./pages/AddProductPage";
import EditProductPage from "./pages/EditProductPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminOrderDetailPage from "./pages/AdminOrderDetailPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStatsPage from "./pages/AdminStatsPage";
import AdminStockPage from "./pages/AdminStockPage";
import AdminTopProducts from "./pages/AdminTopProducts";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminExcelUploadPage from "./pages/AdminExcelUploadPage";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Router>
        <Header />

        <main className="flex-1">
          <Routes>
            {/* Kullanıcı Sayfaları */}
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/thankyou" element={<ThankYouPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/myorders" element={<MyOrdersPage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/orders/:id" element={<AdminOrderDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} /> {/* ✅ Hakkımızda */}
            <Route path="/privacy" element={<PrivacyPage />} /> {/* ✅ Gizlilik */}

            {/* Admin Sayfaları */}
            <Route path="/admin/products" element={<AdminRoute><AdminProductPage /></AdminRoute>} />
            <Route path="/admin/products/:id/edit" element={<AdminRoute><EditProductPage /></AdminRoute>} />
            <Route path="/admin/add" element={<AdminRoute><AddProductPage /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
            <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetailPage /></AdminRoute>} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/stats" element={<AdminRoute><AdminStatsPage /></AdminRoute>} />
            <Route path="/admin/stock" element={<AdminRoute><AdminStockPage /></AdminRoute>} />
            <Route path="/admin/top-products" element={<AdminRoute><AdminTopProducts /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
            <Route path="/admin/uploadexcel" element={<AdminRoute><AdminExcelUploadPage /></AdminRoute>} />
            <Route path="/admin/feedback" element={<AdminRoute><AdminFeedbackPage /></AdminRoute>} />
          </Routes>
        </main>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
