import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddProductPage = () => {
  const [form, setForm] = useState({
    name: "",
    image: "",
    brand: "",
    category: "",
    description: "",
    price: 0,
    discountPrice: 0, // ✅ Sadece discountPrice
    countInStock: 0,
  });

  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setForm((prev) => ({ ...prev, image: res.data.url }));
      toast.success("✅ Resim başarıyla yüklendi!");
    } catch (err) {
      console.error("Resim yüklenemedi:", err.message);
      toast.error("❌ Resim yüklenemedi.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/products", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Ürün başarıyla eklendi!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Ürün ekleme hatası:", err.message);
      toast.error("❌ Ürün eklenemedi.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">➕ Yeni Ürün Ekle</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Görsel Yükleme */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border p-2 rounded"
        />
        {uploading && <p className="text-blue-600">Resim yükleniyor...</p>}
        {form.image && (
          <img
            src={form.image}
            alt="Ürün"
            className="w-32 h-32 object-cover rounded"
          />
        )}

        {/* Diğer Alanlar */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Ürün Adı"
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="brand"
          value={form.brand}
          onChange={handleChange}
          placeholder="Marka"
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Kategori"
          required
          className="border p-2 rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Açıklama"
          required
          className="border p-2 rounded min-h-[100px]"
        ></textarea>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Fiyat (₺)"
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="discountPrice"
          value={form.discountPrice}
          onChange={handleChange}
          placeholder="İndirimli Fiyat (₺) (Varsa)"
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="countInStock"
          value={form.countInStock}
          onChange={handleChange}
          placeholder="Stok Adedi"
          required
          className="border p-2 rounded"
        />

        {/* Kaydet Butonu */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
