import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Siparişleri alırken hata:", err.message);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchOrders(); // güncellemeden sonra listeyi yenile
    } catch (err) {
      console.error("Durum güncellenemedi:", err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📋 Tüm Siparişler (Admin)</h1>
      <ul>
        {orders.map((order) => (
          <li key={order._id} style={{ marginBottom: "1.5rem" }}>
            🆔 {order._id} <br />
            👤 {order.user?.name || "Bilinmiyor"} <br />
            💵 {order.totalPrice} TL <br />
            🚚 Durum: <strong>{order.status || "Hazırlanıyor"}</strong> <br />
            <button
              onClick={() => updateStatus(order._id, "Kargoda")}
              style={{ marginRight: "0.5rem" }}
            >
              Kargoya Ver
            </button>
            <button onClick={() => updateStatus(order._id, "Teslim Edildi")}>
              Teslim Et
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminOrderList;
