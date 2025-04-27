import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(data);
    } catch (error) {
      console.error(error);
      toast.error("❌ Sipariş alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`✅ Durum "${status}" olarak güncellendi.`);
      fetchOrder(); // Durum güncellendiğinde tekrar veriyi çekelim
    } catch (error) {
      console.error(error);
      toast.error("❌ Durum güncellenemedi.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-xl font-bold text-gray-600">
        Yükleniyor...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-xl font-bold text-red-500">
        Sipariş bulunamadı.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">📦 Admin Sipariş Detayı</h1>

      {/* Sipariş Bilgileri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded shadow space-y-2">
          <h2 className="text-xl font-bold mb-4">Kargo Bilgileri</h2>
          <p><strong>Adres:</strong> {order.shippingAddress.address}</p>
          <p><strong>Şehir:</strong> {order.shippingAddress.city}</p>
          <p><strong>Posta Kodu:</strong> {order.shippingAddress.postalCode}</p>
          <p><strong>Ülke:</strong> {order.shippingAddress.country}</p>
        </div>

        <div className="bg-white p-6 rounded shadow space-y-2">
          <h2 className="text-xl font-bold mb-4">Ödeme Bilgileri</h2>
          <p><strong>Ödeme Yöntemi:</strong> {order.paymentMethod}</p>
          <p><strong>Ödeme:</strong> {order.isPaid ? "✅ Ödendi" : "❌ Ödenmedi"}</p>
          <p><strong>Toplam:</strong> {order.totalPrice.toLocaleString()} ₺</p>
        </div>
      </div>

      {/* Sipariş Ürünleri */}
      <div className="bg-white p-6 rounded shadow mt-10">
        <h2 className="text-xl font-bold mb-6">Ürünler</h2>
        {order.orderItems.map((item) => (
          <div key={item._id} className="flex items-center gap-6 border-b pb-4 mb-4">
            <img src={item.image || "/placeholder.jpg"} alt={item.name} className="w-20 h-20 rounded object-cover" />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-gray-500 text-sm">
                {item.qty} x {item.price.toLocaleString()} ₺
              </p>
            </div>
            <p className="text-blue-600 font-bold">
              {(item.qty * item.price).toLocaleString()} ₺
            </p>
          </div>
        ))}
      </div>

      {/* Durum Güncelle */}
      <div className="bg-white p-6 rounded shadow mt-10 space-y-4">
        <h2 className="text-xl font-bold mb-4">Durumu Güncelle</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => updateStatus("Hazırlanıyor")}
            className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded text-black"
          >
            Hazırlanıyor
          </button>
          <button
            onClick={() => updateStatus("Kargoda")}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
          >
            Kargoda
          </button>
          <button
            onClick={() => updateStatus("Teslim Edildi")}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
          >
            Teslim Edildi
          </button>
          <button
            onClick={() => updateStatus("İptal Edildi")}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
          >
            İptal Edildi
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;
