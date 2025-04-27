import React, { useState } from "react";
import axios from "axios";

const AddOrderPage = () => {
  const [form, setForm] = useState({
    userId: "",
    shippingAddress: "",
    paymentMethod: "",
    totalPrice: 0,
    isPaid: false,
    isDelivered: false,
  });
  const [orderItems, setOrderItems] = useState([{ name: "", quantity: 1, price: 0 }]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...orderItems];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
    setOrderItems(updatedItems);
  };

  const addItem = () => {
    setOrderItems([...orderItems, { name: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    const updatedItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const orderData = {
        ...form,
        orderItems, // `orderItems`'ı form verilerine ekliyoruz
      };

      const res = await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      alert("✅ Sipariş oluşturuldu!");
      console.log(res.data);
    } catch (err) {
      console.error("Sipariş oluşturulurken hata:", err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>➕ Yeni Sipariş Oluştur</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
        <input
          type="text"
          name="userId"
          value={form.userId}
          onChange={handleChange}
          placeholder="Kullanıcı ID"
          style={{ marginBottom: "1rem", padding: "0.5rem" }}
        />
        <input
          type="text"
          name="shippingAddress"
          value={form.shippingAddress}
          onChange={handleChange}
          placeholder="Teslimat Adresi"
          style={{ marginBottom: "1rem", padding: "0.5rem" }}
        />
        <input
          type="text"
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          placeholder="Ödeme Yöntemi"
          style={{ marginBottom: "1rem", padding: "0.5rem" }}
        />
        <input
          type="number"
          name="totalPrice"
          value={form.totalPrice}
          onChange={handleChange}
          placeholder="Toplam Fiyat"
          style={{ marginBottom: "1rem", padding: "0.5rem" }}
        />
        <div>
          <label>
            Ödendi:
            <input
              type="checkbox"
              name="isPaid"
              checked={form.isPaid}
              onChange={(e) => setForm({ ...form, isPaid: e.target.checked })}
            />
          </label>
        </div>
        <div>
          <label>
            Teslim Edildi:
            <input
              type="checkbox"
              name="isDelivered"
              checked={form.isDelivered}
              onChange={(e) => setForm({ ...form, isDelivered: e.target.checked })}
            />
          </label>
        </div>

        {orderItems.map((item, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              name="name"
              value={item.name}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="Ürün Adı"
              style={{ marginBottom: "1rem", padding: "0.5rem" }}
            />
            <input
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="Miktar"
              style={{ marginBottom: "1rem", padding: "0.5rem" }}
            />
            <input
              type="number"
              name="price"
              value={item.price}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="Fiyat"
              style={{ marginBottom: "1rem", padding: "0.5rem" }}
            />
            <button type="button" onClick={() => removeItem(index)} style={{ background: "#ff3b3b", color: "white" }}>
              Ürünü Kaldır
            </button>
          </div>
        ))}
        <button type="button" onClick={addItem} style={{ marginTop: "1rem", padding: "0.5rem", background: "#28a745", color: "white" }}>
          Yeni Ürün Ekle
        </button>
        <button type="submit" style={{ padding: "0.5rem", background: "#1f7aed", color: "white", border: "none" }}>
          Kaydet
        </button>
      </form>
    </div>
  );
};

export default AddOrderPage;
