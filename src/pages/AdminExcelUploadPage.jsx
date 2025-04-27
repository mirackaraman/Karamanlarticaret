import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminExcelUploadPage = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Lütfen bir dosya seçin!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/uploadexcel/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✅ Ürünler başarıyla yüklendi!");
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error("❌ Yükleme sırasında hata oluştu!");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">📥 Excel ile Ürün Yükle</h1>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Yükle
      </button>
    </div>
  );
};

export default AdminExcelUploadPage;
