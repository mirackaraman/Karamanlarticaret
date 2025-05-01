import React from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CartPage = () => {
  const { cart = [], updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => {
    const price = item.discountPrice > 0 ? item.discountPrice : item.price;
    return acc + price * item.quantity;
  }, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.warn("❗ Sepet boş, ödeme yapamazsınız!");
    } else {
      navigate("/checkout");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4">🛒 Sepetiniz boş!</h2>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">🛒 Sepetim</h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Ürünler Listesi */}
        <div className="flex-1 space-y-6">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded shadow"
            >
              <img
                src={item.image || "/placeholder.jpg"}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />

              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-500">
                  {item.brand} | {item.category}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(item._id, Math.max(item.quantity - 1, 1))
                    }
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-blue-600">
                  {(
                    (item.discountPrice > 0 ? item.discountPrice : item.price) *
                    item.quantity
                  ).toLocaleString()}{" "}
                  ₺
                </span>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-600 hover:text-red-700 text-xs font-medium mt-2 transition"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Özet */}
        <div className="w-full md:w-80 bg-white p-6 rounded shadow space-y-6">
          <h2 className="text-xl font-bold border-b pb-2">Özet</h2>

          <div className="flex justify-between">
            <span>Ara Toplam:</span>
            <span className="font-semibold">{total.toLocaleString()} ₺</span>
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <span>Kargo:</span>
            <span>Ücretsiz</span>
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Toplam:</span>
            <span>{total.toLocaleString()} ₺</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-2 rounded font-semibold transition ${
              cart.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            ➡️ Siparişi Tamamla
          </button>

          <Link
            to="/"
            className="w-full inline-block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
          >
            🔄 Alışverişe Devam Et
          </Link>

          <button
            onClick={clearCart}
            className="w-full text-red-600 hover:text-red-700 text-sm mt-4"
          >
            🗑️ Sepeti Temizle
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
