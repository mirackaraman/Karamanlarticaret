import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const isDiscounted = product.discountPrice && product.discountPrice > 0;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i}>
          {i <= rating ? "⭐" : "☆"}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 overflow-hidden group">
      
      {/* İndirim Etiketi */}
      {isDiscounted && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
          İndirim!
        </span>
      )}

      {/* Ürün Resmi */}
      <Link to={`/product/${product._id}`} className="block">
        <img
          src={product.image || "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>

      {/* Ürün Bilgileri */}
      <div className="p-4 flex flex-col justify-between h-44">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition mb-2">
            {product.name}
          </h2>
        </Link>

        {/* ⭐ Rating */}
        <div className="text-yellow-400 text-sm mb-2">
          {renderStars(Math.round(product.rating || 0))}
        </div>

        {/* Fiyat */}
        <div>
          {isDiscounted ? (
            <div className="flex flex-col">
              <span className="text-gray-400 line-through text-sm">
                {product.price.toLocaleString()} ₺
              </span>
              <span className="text-red-600 text-lg font-bold">
                {product.discountPrice.toLocaleString()} ₺
              </span>
            </div>
          ) : (
            <span className="text-blue-600 text-lg font-bold">
              {product.price.toLocaleString()} ₺
            </span>
          )}
        </div>

        {/* Sepete Ekle */}
        <button
          onClick={() => addToCart(product)}
          className="mt-3 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition duration-300 transform hover:scale-105"
        >
          🛒 Sepete Ekle
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
