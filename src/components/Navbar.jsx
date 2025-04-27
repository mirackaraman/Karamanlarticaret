import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">🛒 Miraç Market</h1>
      <div className="space-x-4">
        <Link to="/products" className="text-gray-700 hover:text-blue-500">Ürünler</Link>
        <Link to="/cart" className="text-gray-700 hover:text-blue-500">Sepet</Link>
        <Link to="/register" className="text-gray-700 hover:text-blue-500">Kayıt</Link>
        <Link to="/login" className="text-gray-700 hover:text-blue-500">Giriş</Link>
      </div>
    </nav>
  );
}
