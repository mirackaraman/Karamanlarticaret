import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const AdminStatsPage = () => {
  const [stats, setStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/orders/stats/daily", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setStats(res.data);
      } catch (err) {
        console.error("📊 İstatistik verisi alınamadı:", err.message);
      }
    };

    const fetchTopProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/orders/stats/top-products", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setTopProducts(res.data);
      } catch (err) {
        console.error("🥇 En çok satan ürünler alınamadı:", err.message);
      }
    };

    fetchStats();
    fetchTopProducts();
  }, []);

  const totalOrders = stats.reduce((sum, day) => sum + day.totalOrders, 0);
  const totalSales = stats.reduce((sum, day) => sum + day.totalSales, 0);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📈 Günlük Sipariş İstatistikleri</h1>
      {stats.length === 0 ? (
        <p>Yükleniyor...</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={stats}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="totalOrders" stroke="#8884d8" name="Sipariş Adedi" />
              <Line type="monotone" dataKey="totalSales" stroke="#82ca9d" name="Toplam Satış (₺)" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ marginTop: "1.5rem" }}>
            <p>📦 <strong>Toplam Sipariş:</strong> {totalOrders.toLocaleString()}</p>
            <p>💰 <strong>Toplam Satış:</strong> {totalSales.toLocaleString()} ₺</p>
          </div>
        </>
      )}

      <h2 style={{ marginTop: "3rem" }}>🥇 En Çok Satan Ürünler</h2>
      {topProducts.length === 0 ? (
        <p>Yükleniyor...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts} layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="_id" />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalSold" fill="#8884d8" name="Satış Adedi" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AdminStatsPage;