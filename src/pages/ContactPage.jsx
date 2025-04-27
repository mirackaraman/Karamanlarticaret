import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/feedback", form);
      toast.success("✅ Mesajınız başarıyla gönderildi!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("❌ Mesaj gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">📩 Bize Ulaşın</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Adınız"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="E-posta"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          name="message"
          placeholder="Mesajınız..."
          value={form.message}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded min-h-[120px]"
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          {loading ? "Gönderiliyor..." : "Gönder"}
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
