import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🛒 Sepet</h1>
      {cart.length === 0 ? (
        <p>Sepetiniz boş. <Link to="/">Ürünlere git</Link></p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item._id} style={{ marginBottom: "1rem" }}>
                {item.name} x {item.quantity} - {item.price * item.quantity} TL
                <button
                  onClick={() => removeFromCart(item._id)}
                  style={{
                    marginLeft: "1rem",
                    background: "#ff3b3b",
                    color: "white",
                    border: "none",
                    padding: "0.3rem 0.6rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Kaldır
                </button>
              </li>
            ))}
          </ul>
          <h3>Toplam: {total} TL</h3>
        </>
      )}
    </div>
  );
};

export default CartPage;
