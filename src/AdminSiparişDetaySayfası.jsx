import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AdminOrderDetailPage = () => {
  const { id } = useParams(); // URL'den sipariş ID'sini al
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Admin Token
          },
        });
        setOrder(res.data);
      } catch (err) {
        console.error("Sipariş detayları alınamadı:", err.message);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const updateOrderStatus = async (status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOrder(res.data); // Durum güncellendikten sonra siparişi güncelle
    } catch (err) {
      console.error("Durum güncellenemedi:", err.message);
    }
  };

  if (!order) return <p>Yükleniyor...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📦 Sipariş Detayı</h1>
      <p><strong>Sipariş ID:</strong> {order._id}</p>
      <p><strong>Toplam:</strong> {order.totalPrice} TL</p>
      <p><strong>Durum:</strong> {order.isDelivered ? "✅ Teslim Edildi" : "🚚 Yolda"}</p>
      <p><strong>Ödeme Durumu:</strong> {order.isPaid ? "✅ Ödendi" : "❌ Ödenmedi"}</p>
      <p><strong>Adres:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}</p>

      <h3>🛒 Ürünler</h3>
      <ul>
        {order.orderItems.map((item) => (
          <li key={item._id}>
            {item.name} x {item.qty} - {item.price} TL
          </li>
        ))}
      </ul>

      <div>
        <h4>Durum Güncelle</h4>
        <button onClick={() => updateOrderStatus("Kargoya Verildi")} style={{ margin: "0.5rem" }}>
          Kargoya Verildi
        </button>
        <button onClick={() => updateOrderStatus("Teslim Edildi")} style={{ margin: "0.5rem" }}>
          Teslim Edildi
        </button>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;
