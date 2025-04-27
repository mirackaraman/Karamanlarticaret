import React from "react";
import { useLocation, Link } from "react-router-dom";

const ThankYouPage = () => {
  const location = useLocation();
  const { orderId, totalPrice } = location.state || {};

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <img
        src="/images/thankyou.svg"
        alt="Teşekkürler"
        className="w-48 h-48 mb-6 animate-bounce"
      />
      
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        🎉 Siparişiniz Alındı!
      </h1>

      {orderId && (
        <div className="text-gray-700 mb-6">
          <p className="text-lg">Sipariş Numaranız: <strong>{orderId.slice(-6)}</strong></p>
          <p className="text-lg">Toplam Tutar: <strong>{totalPrice?.toLocaleString()} ₺</strong></p>
        </div>
      )}

      <Link
        to="/"
        className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold"
      >
        🛒 Alışverişe Devam Et
      </Link>
    </div>
  );
};

export default ThankYouPage;
