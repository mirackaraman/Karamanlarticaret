import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(data.name);
        setEmail(data.email);
      } catch (error) {
        console.error(error);
        toast.error("❌ Profil bilgisi alınamadı.");
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/users/profile",
        { name, password, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Profil başarıyla güncellendi!");
      setPassword(""); 
      setNewPassword("");
    } catch (error) {
      console.error(error);
      toast.error("❌ Güncelleme başarısız.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">👤 Profilim</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Ad Soyad</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Email (değiştirilemez)</label>
          <input
            type="email"
            className="w-full p-2 border rounded bg-gray-100"
            value={email}
            disabled
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Eski Şifre (zorunlu)</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Yeni Şifre (değiştirmek istemiyorsan boş bırak)</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mt-4"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
