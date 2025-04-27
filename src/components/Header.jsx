import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-white shadow p-4 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <h1 className="text-xl font-bold text-blue-600">Miraç Market</h1>

        {/* Hamburger - Mobil */}
        <button onClick={toggleMenu} className="sm:hidden text-gray-700">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Menü - Masaüstü */}
        <nav className="hidden sm:flex gap-6 text-sm items-center">
          <Link to="/" className="hover:text-blue-600 font-medium">Ürünler</Link>
          <Link to="/cart" className="hover:text-blue-600 font-medium">Sepet</Link>
          <Link to="/register" className="hover:text-blue-600 font-medium">Kayıt</Link>
          <Link to="/contact" className="hover:text-blue-600 font-medium">İletişim</Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium">👋 {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:underline text-sm"
              >
                Çıkış Yap
              </button>
            </div>
          ) : (
            <Link to="/login" className="hover:text-blue-600 font-medium">Giriş</Link>
          )}
        </nav>
      </div>

      {/* Menü - Mobil Açılır */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-3 mt-4 px-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700">Ürünler</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700">Sepet</Link>
          <Link to="/register" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700">Kayıt</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700">İletişim</Link>

          {user ? (
            <>
              <span className="text-sm text-gray-700">👋 {user.name}</span>
              <button onClick={handleLogout} className="text-sm text-red-600">Çıkış Yap</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700">Giriş</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
