import React from "react";

const PrivacyPage = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Gizlilik Politikası</h1>
      <p className="text-gray-700 leading-relaxed">
        Müşteri bilgileriniz bizim için çok değerlidir. 
        Bu site üzerinden topladığımız tüm bilgiler yalnızca sipariş süreçlerinde kullanılmaktadır. 
        Üçüncü şahıslarla paylaşılmaz, satılmaz veya devredilmez.
      </p>
      <p className="text-gray-700 mt-4 leading-relaxed">
        Her zaman müşteri bilgilerinin korunmasına önem veririz ve güncel güvenlik önlemleri uygularız.
      </p>
    </div>
  );
};

export default PrivacyPage;
