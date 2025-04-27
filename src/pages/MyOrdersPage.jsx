import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/orders/myorders", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setOrders(data);
    } catch (error) {
      console.error("Siparişleri alırken hata:", error.message);
      toast.error("❌ Siparişler alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-xl font-bold text-gray-600">
        Yükleniyor...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4">📦 Henüz bir siparişiniz yok.</h2>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">📋 Siparişlerim</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-4 border-b">Sipariş ID</th>
              <th className="text-left py-3 px-4 border-b">Tarih</th>
              <th className="text-left py-3 px-4 border-b">Tutar</th>
              <th className="text-left py-3 px-4 border-b">Durum</th>
              <th className="text-left py-3 px-4 border-b">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{order._id.slice(-6)}</td>
                <td className="py-3 px-4 border-b">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 border-b">{order.totalPrice.toLocaleString()} ₺</td>
                <td className="py-3 px-4 border-b">
                  {order.isPaid ? "✅ Ödendi" : "❌ Ödenmedi"}
                </td>
                <td className="py-3 px-4 border-b">
                  <Link
                    to={`/orders/${order._id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm"
                  >
                    Detay
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrdersPage;
