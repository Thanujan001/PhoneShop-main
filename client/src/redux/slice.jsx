import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: JSON.parse(localStorage.getItem("cart")) || [], // Load cart from localStorage
  },
  reducers: {
    addCart: (state, action) => {
      state.cart.push(action.payload);
      localStorage.setItem("cart", JSON.stringify(state.cart)); // Save to localStorage
    },
    removeCart: (state, action) => {
      state.cart = state.cart.filter((item) => item._id !== action.payload._id);
      localStorage.setItem("cart", JSON.stringify(state.cart)); // Update localStorage
    },
    updateQuantity: (state, action) => {
      const { _id, quantity } = action.payload;
      const item = state.cart.find((item) => item._id === _id);
      if (item) {
        item.quantity = quantity; // Update the quantity
        localStorage.setItem("cart", JSON.stringify(state.cart)); // Update localStorage
      }
    },
  },
});

export const { addCart, removeCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
