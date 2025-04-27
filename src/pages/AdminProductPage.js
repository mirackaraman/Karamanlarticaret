import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Ürünleri alırken hata:", err.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchProducts();
    } catch (err) {
      console.error("Silme hatası:", err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🧑‍💼 Admin Ürün Paneli</h1>
      <ul>
        {products.map((p) => (
          <li key={p._id} style={{ marginBottom: "1rem" }}>
            <strong>{p.name}</strong> - {p.price} TL

            <Link to={`/admin/products/${p._id}/edit`}>
              <button
                style={{
                  marginLeft: "1rem",
                  background: "#ffc107",
                  padding: "0.3rem 0.6rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Düzenle
              </button>
            </Link>

            <button
              onClick={() => deleteProduct(p._id)}
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
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProductPage;
