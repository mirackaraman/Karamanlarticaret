// src/pages/AdminImportPage.jsx
import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

const AdminImportPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);

      setProducts(json);
    };
    reader.readAsBinaryString(file);
  };

  const handleUpload = async () => {
    if (products.length === 0) {
      toast.error("❌ Önce bir dosya seçin!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/products/import", { products }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Ürünler başarıyla yüklendi!");
      setProducts([]);
    } catch (err) {
      console.error("Yükleme hatası:", err.message);
      toast.error("❌ Yükleme sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📥 Excel'den Ürün İçe Aktar</h1>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="border p-2 rounded mb-4 w-full"
      />

      {products.length > 0 && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-lg font-semibold mb-2">Önizleme ({products.length} ürün):</h2>
          <ul className="list-disc pl-6 space-y-1">
            {products.map((p, index) => (
              <li key={index}>{p.name} — {p.price} ₺</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Yükleniyor..." : "Ürünleri Yükle"}
      </button>
    </div>
  );
};

export default AdminImportPage;
