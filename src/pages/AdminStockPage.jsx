import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminStockPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showLowStock, setShowLowStock] = useState(false); // 🔥 Düşük stok filtresi

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/products");
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error("Ürünler yüklenemedi.");
    }
  };

  const handleStockChange = async (id, newStock) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        { countInStock: newStock },
        { headers: { Authorization: `Bearer ${token}` }
      });
      setProducts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, countInStock: newStock } : p
        )
      );
      toast.success("✅ Stok güncellendi.");
    } catch (error) {
      console.error(error);
      toast.error("❌ Stok güncellenemedi.");
    }
  };

  const handleResetStocks = async () => {
    if (!window.confirm("Tüm stokları sıfırlamak istediğine emin misin?")) return;
    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        products.map((p) =>
          axios.put(
            `http://localhost:5000/api/products/${p._id}`,
            { countInStock: 0 },
            { headers: { Authorization: `Bearer ${token}` }
          })
        )
      );
      fetchProducts();
      toast.success("✅ Tüm stoklar sıfırlandı!");
    } catch (error) {
      console.error(error);
      toast.error("❌ Stok sıfırlama hatası.");
    }
  };

  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) => (showLowStock ? p.countInStock < 5 : true));

  const totalStock = products.reduce((sum, p) => sum + p.countInStock, 0);
  const lowStockCount = products.filter((p) => p.countInStock < 5).length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📦 Admin Stok Yönetimi</h1>

      {/* Özet */}
      <div className="flex gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow w-full text-center">
          <p className="text-gray-500 text-sm">Toplam Stok</p>
          <p className="text-xl font-bold">{totalStock} adet</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow w-full text-center">
          <p className="text-gray-500 text-sm">Düşük Stoklu Ürün</p>
          <p className="text-xl font-bold">{lowStockCount} ürün</p>
        </div>
      </div>

      {/* Ara ve Filtre Butonları */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Ürün Ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        />
        <button
          onClick={() => setShowLowStock((prev) => !prev)}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded w-full md:w-auto"
        >
          {showLowStock ? "🔄 Tüm Ürünler" : "⚠️ Düşük Stok"}
        </button>
        <button
          onClick={handleResetStocks}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full md:w-auto"
        >
          🧹 Stokları Sıfırla
        </button>
      </div>

      {/* Ürünler Tablosu */}
      <div className="overflow-x-auto">
        {filteredProducts.length === 0 ? (
          <p>Ürün bulunamadı.</p>
        ) : (
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Ürün</th>
                <th className="p-2 border">Stok</th>
                <th className="p-2 border">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="text-center border-t">
                  <td className="p-2 border">{product.name}</td>
                  <td className="p-2 border">
                    {product.countInStock}{" "}
                    {product.countInStock < 5 && (
                      <span className="text-yellow-500 font-bold ml-2">
                        (Düşük)
                      </span>
                    )}
                  </td>
                  <td className="p-2 border">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          handleStockChange(product._id, product.countInStock + 1)
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                      >
                        +1
                      </button>
                      <button
                        onClick={() =>
                          handleStockChange(product._id, product.countInStock - 1)
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                        disabled={product.countInStock === 0}
                      >
                        -1
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminStockPage;
