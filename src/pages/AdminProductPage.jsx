import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx"; // 📥 Excel import

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products", { withCredentials: true });
      setProducts(res.data);
    } catch (err) {
      toast.error("\u274C \u00dcrünler yüklenemedi.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("\u2757 Bu ürünü silmek istiyor musunuz?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("\u2705 Ürün silindi!");
    } catch {
      toast.error("\u274C Silme hatası.");
    }
  };

  const handleSelectProduct = (id) => {
    setSelectedProducts((prev) => prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p._id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return toast.warn("\u2757 Ürün seçin.");
    if (!window.confirm(`\u2757 ${selectedProducts.length} ürün silinsin mi?`)) return;

    try {
      const token = localStorage.getItem("token");
      await Promise.all(selectedProducts.map((id) =>
        axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ));
      setProducts((prev) => prev.filter((p) => !selectedProducts.includes(p._id)));
      setSelectedProducts([]);
      toast.success("\u2705 Seçili ürünler silindi!");
    } catch {
      toast.error("\u274C Toplu silme hatası.");
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const binaryStr = evt.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      try {
        const token = localStorage.getItem("token");
        await axios.post("http://localhost:5000/api/products/import", { products: jsonData }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(`\u2705 ${jsonData.length} ürün yüklendi!`);
        fetchProducts();
      } catch {
        toast.error("\u274C Yükleme hatası.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter === "" || p.category === categoryFilter))
    .sort((a, b) => sortOrder === "asc" ? a.price - b.price : sortOrder === "desc" ? b.price - a.price : 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">\ud83d\udce6 Admin \u00dcrün Yönetimi</h1>

      {/* Butonlar ve filtreler */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex gap-2">
          <Link to="/admin/add">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded">➕ Yeni Ürün</button>
          </Link>

          <label className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded cursor-pointer">
            📥 Toplu Yükle
            <input type="file" accept=".xlsx, .csv" onChange={handleImportFile} className="hidden" />
          </label>

          <button
            onClick={handleBulkDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded"
          >🗑️ Seçili Sil</button>
        </div>

        <input
          type="text"
          placeholder="Ürün Ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-64"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded w-full md:w-48"
        >
          <option value="">Tüm Kategoriler</option>
          <option value="İçecek">İçecek</option>
          <option value="Atıştırmalık">Atıştırmalık</option>
          <option value="Temizlik">Temizlik</option>
          <option value="Kırtasiye">Kırtasiye</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2 rounded w-full md:w-48"
        >
          <option value="">Sıralama Yok</option>
          <option value="asc">Fiyat (Artan)</option>
          <option value="desc">Fiyat (Azalan)</option>
        </select>
      </div>

      {/* Ürün Listesi */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">Hiç ürün bulunamadı.</p>
      ) : (
        <ul className="space-y-4">
          {/* Tümünü Seç Checkbox */}
          <li className="flex items-center p-2 gap-2">
            <input
              type="checkbox"
              checked={selectedProducts.length === products.length}
              onChange={handleSelectAll}
            />
            <span className="text-sm text-gray-600">Tümünü Seç</span>
          </li>

          {filteredProducts.map((product) => (
            <li key={product._id} className="bg-white p-4 rounded shadow flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product._id)}
                  onChange={() => handleSelectProduct(product._id)}
                />
                <img
                  src={product.image || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded border"
                />
                <div className="flex flex-col">
                  <strong>{product.name}</strong>
                  <span className="text-gray-500 text-sm">
                    {product.category} — {product.price.toLocaleString()} ₺
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-3 md:mt-0">
                <Link to={`/admin/products/${product._id}/edit`}>
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1 rounded">Düzenle</button>
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                >Sil</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminProductPage;
