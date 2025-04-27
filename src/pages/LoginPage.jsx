import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/users/login", { email, password }, { withCredentials: true });
      localStorage.setItem("token", data.token);
      toast.success("✅ Giriş başarılı!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Giriş başarısız.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-6">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-blue-600">🔑 Giriş Yap</h1>

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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded"
        >
          Giriş Yap
        </button>

        <p className="text-center text-sm text-gray-500">
          Hesabınız yok mu?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Kayıt Ol
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
