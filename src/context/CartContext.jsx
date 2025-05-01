import { createContext, useContext, useReducer, useEffect } from "react";

// 1. Context oluştur
const CartContext = createContext();

// 2. useCart hook'u
export const useCart = () => {
  return useContext(CartContext);
};

// 3. Provider
export const CartProvider = ({ children }) => {
  // Başlangıçta localStorage'dan oku
  const initialState = {
    cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "ADD_TO_CART":
        const existingItem = state.cartItems.find(
          (item) => item._id === action.payload._id
        );
        if (existingItem) {
          // Eğer ürün zaten sepette varsa, miktarını artır
          return {
            ...state,
            cartItems: state.cartItems.map((item) =>
              item._id === action.payload._id
                ? { ...item, qty: item.qty + 1 }
                : item
            ),
          };
        } else {
          // Yoksa ürünü sepete ekle
          return {
            ...state,
            cartItems: [...state.cartItems, { ...action.payload, qty: 1 }],
          };
        }

      case "REMOVE_FROM_CART":
        return {
          ...state,
          cartItems: state.cartItems.filter(
            (item) => item._id !== action.payload
          ),
        };

      case "CLEAR_CART":
        return {
          ...state,
          cartItems: [],
        };

      case "UPDATE_QUANTITY":
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item._id === action.payload.id
              ? { ...item, qty: action.payload.qty }
              : item
          ),
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // Sepete ekleme fonksiyonu
  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  // Sepetten çıkarma fonksiyonu
  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  // Sepeti temizleme fonksiyonu
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  // Sepette ürün adedi değiştirme fonksiyonu
  const updateQuantity = (id, qty) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, qty } });
  };

  // Her cart değişiminde localStorage güncelle
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  return (
    <CartContext.Provider
      value={{
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        cartItems: state.cartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
