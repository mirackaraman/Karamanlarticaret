import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products", {
          withCredentials: true,
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Veri çekme hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter === "" || product.category === categoryFilter)
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-xl font-bold text-gray-600">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* ✅ HERO Alanı */}
      <section className="relative bg-blue-50 rounded-xl overflow-hidden mb-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-6 py-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-700">
              Miraç Market'e Hoşgeldiniz!
            </h1>
            <p className="text-gray-600 mb-6">
              En taze ürünler, en uygun fiyatlarla burada. Şimdi keşfetmeye başla!
            </p>
            <a href="#products" className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
              🛒 Alışverişe Başla
            </a>
          </div>

          <div className="flex-1 hidden md:block">
            <img
              src="/banner.jpg" // 📷 Public klasörüne bir banner.jpg koy!
              alt="Miraç Market Banner"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Başlık */}
      <h2 id="products" className="text-3xl font-bold mb-8 text-gray-800 hover:text-blue-600 transition duration-300 transform hover:scale-105">
        🛍️ Ürünler
      </h2>

      {/* İçerik */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64">
          <div className="bg-white p-4 rounded-xl shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">🏷️ Kategoriler</h3>
            <ul className="space-y-2">
              {["", "İçecek", "Atıştırmalık", "Temizlik", "Kırtasiye"].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setCategoryFilter(cat)}
                    className={`block w-full text-left hover:underline ${categoryFilter === cat ? "text-blue-600 font-bold" : "text-gray-700"}`}
                  >
                    {cat === "" ? "Tümü" : cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">💰 Fiyat Sıralama</h3>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Varsayılan</option>
              <option value="asc">Fiyat (Artan)</option>
              <option value="desc">Fiyat (Azalan)</option>
            </select>
          </div>
        </aside>

        {/* Ürünler */}
        <main className="flex-1">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Ürün ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center text-gray-500 text-lg">
              Ürün bulunamadı.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default ProductList;
