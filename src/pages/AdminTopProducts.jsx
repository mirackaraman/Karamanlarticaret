import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const AdminTopProducts = () => {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/products/top");
      setTopProducts(data);
    } catch (err) {
      console.error("En çok satan ürünler alınamadı:", err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🔥 En Çok Satan Ürünler</h1>

      {topProducts.length === 0 ? (
        <p>Henüz satış yok.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Ürün Listesi */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">🛍️ Ürün Listesi</h2>
            <ul className="space-y-3">
              {topProducts.map((product) => (
                <li key={product._id} className="flex justify-between">
                  <span>{product.name}</span>
                  <span className="font-bold">{product.sold} satış</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">📈 Satış Grafiği</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sold" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminTopProducts;
