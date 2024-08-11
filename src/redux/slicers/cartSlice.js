import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    totalAmount: 0,
    totalQuantity: 0,
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.id === newItem.id);

            if (!existingItem) {
                state.items.push({
                    ...newItem,
                    quantity: 1,
                    totalItemPrice: newItem.price
                });
            } else {
                existingItem.quantity++;
                existingItem.totalItemPrice += newItem.price;
            }

            state.totalAmount += newItem.price;
            state.totalQuantity += 1;
        },

        incrementQuantity: (state, action) => {
            const item = state.items.find((item) => item.id === action.payload);

            if (item) {
                item.quantity++;
                item.totalItemPrice += item.price;
                state.totalAmount += item.price;
                state.totalQuantity += 1;
            }
        },

        decrementQuantity: (state, action) => {
            const item = state.items.find((item) => item.id === action.payload);

            if (item) {
                if (item.quantity > 1) {
                    item.quantity--;
                    item.totalItemPrice -= item.price;
                    state.totalAmount -= item.price;
                    state.totalQuantity -= 1;
                } else {
                    // Remove item if quantity goes to 0
                    state.items = state.items.filter((i) => i.id !== item.id);
                    state.totalAmount -= item.price;
                    state.totalQuantity -= 1;
                }
            }
        },

        removeItemFromCart: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                state.totalAmount -= existingItem.totalItemPrice;
                state.totalQuantity -= existingItem.quantity;
                state.items = state.items.filter((item) => item.id !== id);
            }
        },
    }
});

export const { addToCart, incrementQuantity, decrementQuantity, removeItemFromCart } = cartSlice.actions;

export default cartSlice.reducer;
