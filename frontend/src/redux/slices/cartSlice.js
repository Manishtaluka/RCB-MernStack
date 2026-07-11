import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // { productId, name, price, image, size, quantity, stock }
  },
  reducers: {
    addToCart: (state, action) => {
      const { productId, size } = action.payload;
      const existing = state.items.find(
        (i) => i.productId === productId && i.size === size
      );
      if (existing) {
        existing.quantity = Math.min(existing.quantity + action.payload.quantity, existing.stock);
      } else {
        state.items.push(action.payload);
      }
    },
    updateQuantity: (state, action) => {
      const { productId, size, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId && i.size === size);
      if (item) item.quantity = Math.max(1, Math.min(quantity, item.stock));
    },
    removeFromCart: (state, action) => {
      const { productId, size } = action.payload;
      state.items = state.items.filter(
        (i) => !(i.productId === productId && i.size === size)
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);

export default cartSlice.reducer;
