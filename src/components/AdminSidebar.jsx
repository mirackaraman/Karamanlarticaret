import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminSidebar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  if (!user?.isAdmin) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen bg-white shadow-md fixed top-0 left-0 p-6 flex flex-col gap-4 text-sm">
      <h2 className="text-xl font-bold text-blue-600 mb-6">🛒 Admin Paneli</h2>

      <Link to="/admin/dashboard" className="hover:text-blue-600">🏠 Dashboard</Link>
      <Link to="/admin/products" className="hover:text-blue-600">📦 Ürünler</Link>
      <Link to="/admin/add" className="hover:text-blue-600">➕ Ürün Ekle</Link>
      <Link to="/admin/stats" className="hover:text-blue-600">📊 İstatistik</Link>
      <Link to="/admin/orders" className="hover:text-blue-600">🧾 Siparişler</Link>
      <Link to="/admin/stock" className="hover:text-blue-600">📉 Stok Takibi</Link>
      <Link to="/admin/users" className="hover:text-blue-600">👥 Kullanıcılar</Link>
      <Link to="/admin/top-products" className="hover:text-blue-600">🔥 Top Ürünler</Link>
      <Link to="/admin/users" className="hover:text-blue-600">👥 Kullanıcılar</Link>

      <hr className="my-4" />

      <button
        onClick={handleLogout}
        className="text-red-600 hover:underline text-left"
      >
        🚪 Çıkış Yap
      </button>
    </aside>
  );
};

export default AdminSidebar;
