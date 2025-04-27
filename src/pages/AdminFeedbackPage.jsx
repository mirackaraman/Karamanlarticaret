import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [search, setSearch] = useState("");

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/feedback", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(res.data);
    } catch (err) {
      toast.error("❌ Geri bildirimler alınamadı.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu mesajı silmek istiyor musunuz?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Mesaj silindi.");
      setFeedbacks((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      toast.error("Silme işlemi başarısız.");
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/feedback/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks((prev) =>
        prev.map((msg) => (msg._id === id ? { ...msg, isRead: true } : msg))
      );
      toast.success("✅ Mesaj okundu olarak işaretlendi.");
    } catch (err) {
      toast.error("İşaretleme hatası.");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const unreadCount = feedbacks.filter((msg) => !msg.isRead).length;

  const filteredFeedbacks = feedbacks.filter(
    (msg) =>
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase()) ||
      msg.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        📥 Gelen Mesajlar {unreadCount > 0 && `(📨 ${unreadCount} okunmadı)`}
      </h1>

      <input
        type="text"
        placeholder="İsim, e-posta veya mesaj ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full max-w-md rounded"
      />

      {filteredFeedbacks.length === 0 ? (
        <p>Hiç mesaj bulunamadı.</p>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks.map((msg) => (
            <div
              key={msg._id}
              className={`bg-white p-4 rounded shadow ${
                !msg.isRead ? "border-l-4 border-blue-500" : ""
              }`}
            >
              <p className="text-sm text-gray-500">
                <strong>{msg.name}</strong> ({msg.email}) —{" "}
                {new Date(msg.createdAt).toLocaleString()}
              </p>
              <p className="my-2">{msg.message}</p>
              <div className="flex gap-3">
                {!msg.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(msg._id)}
                    className="text-sm text-green-600 hover:underline"
                  >
                    Okundu
                  </button>
                )}
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackPage;
