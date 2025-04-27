import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setOrder(data);
      } catch (error) {
        console.error(error);
        toast.error("❌ Sipariş bilgisi alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

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
      <h1 className="text-3xl font-bold mb-8 text-gray-800">📦 Sipariş Detayı</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kargo Bilgileri */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">🚚 Kargo Bilgileri</h2>
          <p><strong>Adres:</strong> {order.shippingAddress.address}</p>
          <p><strong>Şehir:</strong> {order.shippingAddress.city}</p>
          <p><strong>Posta Kodu:</strong> {order.shippingAddress.postalCode}</p>
          <p><strong>Ülke:</strong> {order.shippingAddress.country}</p>
          <p><strong>Durum:</strong> <span className="text-green-600 font-semibold">{order.status || "Bekliyor"}</span></p>
        </div>

        {/* Ödeme Bilgileri */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">💳 Ödeme Bilgileri</h2>
          <p><strong>Ödeme Yöntemi:</strong> {order.paymentMethod}</p>
          <p><strong>Ödeme Durumu:</strong> {order.isPaid ? "✅ Ödendi" : "❌ Ödenmedi"}</p>
          <p><strong>Toplam Tutar:</strong> {order.totalPrice.toLocaleString()} ₺</p>
        </div>
      </div>

      {/* Sipariş Ürünleri */}
      <div className="bg-white p-6 rounded-xl shadow mt-10">
        <h2 className="text-xl font-bold border-b pb-2 mb-6">🛍️ Sipariş Ürünleri</h2>

        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div key={item._id} className="flex items-center gap-6 border-b pb-4">
              <img
                src={item.image || "/placeholder.jpg"}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.qty} x {item.price.toLocaleString()} ₺</p>
              </div>
              <div className="text-blue-600 font-bold text-lg">
                {(item.qty * item.price).toLocaleString()} ₺
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
