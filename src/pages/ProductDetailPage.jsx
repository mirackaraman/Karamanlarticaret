import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext"; // 🛒 Sepet context'i

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(data);
    } catch (err) {
      console.error("Ürün detayı alınamadı:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/products/${id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Yorum başarıyla eklendi!");
      setRating(0);
      setComment("");
      fetchProduct(); // Yorum sonrası güncelle
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "❌ Yorum eklenemedi.");
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>{i < rating ? "⭐" : "☆"}</span>
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-xl font-bold text-gray-600">
        Yükleniyor...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-xl font-bold text-red-500">
        Ürün bulunamadı.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Ürün Detayı */}
      <div className="flex flex-col md:flex-row gap-10">
        <img
          src={product.image || "/placeholder.jpg"}
          alt={product.name}
          className="w-full md:w-1/2 h-auto object-cover rounded-lg shadow"
        />

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="text-yellow-400 text-lg mb-4">
              {renderStars(Math.round(product.rating || 0))}
              <span className="text-gray-600 text-sm ml-2">
                ({product.numReviews} Yorum)
              </span>
            </div>

            {/* Fiyat */}
            {product.discountPrice > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 line-through text-lg">
                  {product.price.toLocaleString()} ₺
                </span>
                <span className="text-red-600 text-2xl font-bold">
                  {product.discountPrice.toLocaleString()} ₺
                </span>
              </div>
            ) : (
              <span className="text-blue-600 text-2xl font-bold">
                {product.price.toLocaleString()} ₺
              </span>
            )}

            <p className="mt-6 text-gray-700">{product.description}</p>

            {/* 🛒 Sepete Ekle Butonu */}
            <button
              onClick={() => {
                addToCart(product);
                toast.success("🛒 Ürün sepete eklendi!");
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded mt-6"
            >
              Sepete Ekle
            </button>

            <p className="text-sm text-gray-500 mt-2">
              Sepete eklemek için giriş yapmanız gerekebilir.
            </p>
          </div>
        </div>
      </div>

      {/* Yorumlar */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">📝 Yorumlar</h2>

        {product.reviews.length === 0 ? (
          <p className="text-gray-500">Henüz yorum yapılmamış.</p>
        ) : (
          <div className="space-y-4 mb-10">
            {product.reviews.map((review) => (
              <div key={review._id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{review.name}</h3>
                  <div className="text-yellow-400">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Yorum Ekleme Formu */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-4">💬 Yorum Yap</h3>

          <form onSubmit={submitReviewHandler} className="space-y-4">
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              className="border p-2 w-full rounded"
            >
              <option value="">Puan Seçin</option>
              <option value="1">1 - Çok Kötü</option>
              <option value="2">2 - Kötü</option>
              <option value="3">3 - İdare Eder</option>
              <option value="4">4 - İyi</option>
              <option value="5">5 - Mükemmel</option>
            </select>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              placeholder="Yorumunuzu yazın..."
              className="border p-2 w-full rounded"
              required
            ></textarea>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
            >
              Gönder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
