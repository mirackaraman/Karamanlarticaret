import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/register", { name, email, password });
      toast.success("✅ Kayıt başarılı, şimdi giriş yapabilirsiniz.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Kayıt başarısız.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-6">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-xl shadow w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-green-600">📝 Kayıt Ol</h1>

        <input
          type="text"
          placeholder="İsim"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 border rounded"
        />

        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border rounded"
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded"
        >
          Kayıt Ol
        </button>

        <p className="text-center text-sm text-gray-500">
          Zaten bir hesabınız var mı?{" "}
          <a href="/login" className="text-green-600 hover:underline">
            Giriş Yap
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
