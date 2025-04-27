import React, { useEffect, useState } from "react";
import axios from "axios";

const SalesGoalCard = () => {
  const [todayStats, setTodayStats] = useState({ totalSales: 0, totalOrders: 0 });
  const dailyGoal = 1000; // 🎯 Günlük hedef: 1000₺

  useEffect(() => {
    const fetchTodaySales = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/orders/stats/today", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodayStats(res.data);
      } catch (err) {
        console.error("Bugünkü satış verisi alınamadı:", err.message);
      }
    };

    fetchTodaySales();
  }, []);

  const progress = Math.min((todayStats.totalSales / dailyGoal) * 100, 100);

  return (
    <div className="bg-white rounded-xl p-4 shadow w-full md:max-w-md">
      <h2 className="text-lg font-semibold mb-2">🎯 Günlük Satış Hedefi</h2>
      <p className="text-sm text-gray-600 mb-2">
        Bugünkü Satış: <strong>{todayStats.totalSales.toLocaleString()}₺</strong> / {dailyGoal}₺
      </p>

      {/* İlerleme Barı */}
      <div className="w-full bg-gray-200 h-4 rounded">
        <div
          className={`h-4 rounded transition-all duration-300 ${
            progress < 50
              ? "bg-red-500"
              : progress < 90
              ? "bg-yellow-400"
              : "bg-green-500"
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Yüzde Gösterimi */}
      <p className="text-right text-xs text-gray-500 mt-1">
        {Math.round(progress)}% tamamlandı
      </p>
    </div>
  );
};

export default SalesGoalCard;
