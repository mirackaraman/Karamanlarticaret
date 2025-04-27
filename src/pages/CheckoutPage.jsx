import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Kredi Kartı");

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const totalPrice = cart.reduce((sum, item) => 
    sum + (item.discountPrice > 0 ? item.discountPrice : item.price) * item.quantity, 0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const orderItems = cart.map((item) => ({
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: item.discountPrice > 0 ? item.discountPrice : item.price,
        product: item._id,
      }));

      const { data } = await axios.post(
        "http://localhost:5000/api/orders",
        {
          orderItems,
          shippingAddress: shipping,
          paymentMethod,
          totalPrice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("✅ Sipariş başarıyla oluşturuldu!");
      clearCart();
      navigate("/thankyou", { state: { orderId: data._id, totalPrice } });
    } catch (err) {
      console.error("Sipariş hatası:", err.message);
      toast.error("❌ Sipariş oluşturulamadı.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4">🛒 Sepetiniz boş!</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">📦 Teslimat ve Ödeme</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sol Kısım: Adres ve Ödeme Formu */}
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">

          {/* Teslimat Bilgisi */}
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-semibold mb-2">🚚 Teslimat Bilgisi</h2>
            {["address", "city", "postalCode", "country"].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                value={shipping[field]}
                onChange={handleShippingChange}
                placeholder={field === "address" ? "Adres" :
                            field === "city" ? "Şehir" :
                            field === "postalCode" ? "Posta Kodu" : "Ülke"}
                required
                className="w-full p-2 border rounded"
              />
            ))}
          </div>

          {/* Ödeme Yöntemi */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">💳 Ödeme Yöntemi</h2>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Kredi Kartı">Kredi Kartı</option>
              <option value="Kapıda Ödeme">Kapıda Ödeme</option>
              <option value="Havale/EFT">Havale / EFT</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded mt-6"
          >
            🛒 Siparişi Tamamla
          </button>
        </form>

        {/* Sağ Kısım: Sipariş Özeti */}
        <div className="bg-white p-6 rounded-xl shadow space-y-6">
          <h2 className="text-xl font-semibold border-b pb-2">🛍️ Sipariş Özeti</h2>
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>
                {((item.discountPrice > 0 ? item.discountPrice : item.price) * item.quantity)
                  .toLocaleString()} ₺
              </span>
            </div>
          ))}
          <div className="border-t pt-4 font-bold flex justify-between">
            <span>Toplam:</span>
            <span>{totalPrice.toLocaleString()} ₺</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
