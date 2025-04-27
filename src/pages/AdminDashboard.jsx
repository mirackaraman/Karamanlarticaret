import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SalesGoalCard from "./SalesGoalCard"; // 🎯 Satış hedefi kartı

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0); // 📩 Yeni eklendi
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const [orderStatsRes, usersRes, productsRes, feedbackRes] = await Promise.all([
          axios.get("http://localhost:5000/api/orders/stats/daily", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/user", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/products", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/feedback", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats(orderStatsRes.data);
        setTotalUsers(usersRes.data.length);
        setTotalProducts(productsRes.data.length);
        setFeedbackCount(feedbackRes.data.length); // 📩 Feedback sayısını al
      } catch (err) {
        console.error("İstatistik alınamadı:", err.message);
      }
    };

    fetchStats();
  }, []);

  const totalSales = stats.reduce((acc, day) => acc + day.totalSales, 0);
  const totalOrders = stats.reduce((acc, day) => acc + day.totalOrders, 0);

  const Card = ({ title, value, link }) => (
    <div
      onClick={() => navigate(link)}
      className="bg-white hover:shadow-md cursor-pointer transition p-4 rounded-xl border text-center"
    >
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Admin Paneli</h1>

      {/* Özet Kutular */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card title="Toplam Sipariş" value={totalOrders} link="/admin/orders" />
        <Card title="Toplam Satış (₺)" value={totalSales.toLocaleString()} link="/admin/stats" />
        <Card title="Toplam Kullanıcı" value={totalUsers} link="/admin/users" />
        <Card title="Toplam Ürün" value={totalProducts} link="/admin/products" />
        <Card title="Gelen Mesajlar" value={feedbackCount} link="/admin/feedback" /> {/* 📩 Buraya geldik */}
      </div>

      {/* 🎯 Günlük Satış Hedefi */}
      <div className="mb-8">
        <SalesGoalCard />
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">📦 Günlük Siparişler</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats}>
              <Line type="monotone" dataKey="totalOrders" stroke="#1f7aed" />
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">💰 Günlük Satışlar (₺)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats}>
              <Line type="monotone" dataKey="totalSales" stroke="#28a745" />
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
