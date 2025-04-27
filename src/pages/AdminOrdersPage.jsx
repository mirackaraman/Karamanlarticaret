import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [keyword, setKeyword] = useState("");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const query = [];

      if (statusFilter) query.push(`status=${statusFilter}`);
      if (keyword) query.push(`keyword=${keyword}`);

      const { data } = await axios.get(
        `http://localhost:5000/api/orders?${query.join("&")}`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      setOrders(data);
    } catch (err) {
      console.error("❌ Siparişleri alırken hata:", err.message);
      toast.error("Siparişler yüklenemedi.");
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  const handleStatusChange = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? { ...order, status } : order))
      );
      toast.success(`✅ Sipariş "${status}" olarak güncellendi!`);
    } catch (err) {
      toast.error("❌ Sipariş durumu güncellenemedi.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Kargoda":
        return <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs">Kargoda</span>;
      case "Teslim Edildi":
        return <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">Teslim</span>;
      case "İade Talebi":
        return <span className="bg-cyan-500 text-white px-2 py-1 rounded-full text-xs">İade</span>;
      case "İptal Edildi":
        return <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">İptal</span>;
      default:
        return <span className="bg-gray-300 text-black px-2 py-1 rounded-full text-xs">Bekliyor</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧑‍💼 Admin Sipariş Yönetimi</h1>

      {/* Arama & Filtre */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Sipariş ID veya Kullanıcı Ara..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border p-2 rounded w-full md:w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded w-full md:w-48"
        >
          <option value="">Tüm Durumlar</option>
          <option value="Hazırlanıyor">Hazırlanıyor</option>
          <option value="Kargoda">Kargoda</option>
          <option value="Teslim Edildi">Teslim Edildi</option>
          <option value="İade Talebi">İade Talebi</option>
          <option value="İptal Edildi">İptal Edildi</option>
        </select>
        <button
          onClick={fetchOrders}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Filtrele
        </button>
      </div>

      {/* Siparişler */}
      <div className="grid gap-4">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">Hiç sipariş bulunamadı.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row justify-between items-center"
            >
              {/* Sipariş Bilgisi */}
              <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
                <div>
                  <p className="font-semibold">#{order._id.slice(-6)}</p>
                  <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-lg font-bold">
                  {order.totalPrice.toLocaleString()} ₺
                </div>
                <div>
                  {getStatusBadge(order.status)}
                </div>
                <div>
                  {order.isPaid ? (
                    <span className="text-green-500 font-bold">✅ Ödendi</span>
                  ) : (
                    <span className="text-red-500 font-bold">❌ Ödenmedi</span>
                  )}
                </div>
              </div>

              {/* İşlemler */}
              <div className="flex gap-2 mt-4 md:mt-0">
                <Link to={`/admin/orders/${order._id}`}>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                    Detay
                  </button>
                </Link>
                <select
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="border p-2 rounded"
                  defaultValue=""
                >
                  <option value="" disabled>Durum Seç</option>
                  <option value="Kargoda">Kargoda</option>
                  <option value="Teslim Edildi">Teslim Edildi</option>
                  <option value="İade Talebi">İade Talebi</option>
                  <option value="İptal Edildi">İptal Edildi</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
