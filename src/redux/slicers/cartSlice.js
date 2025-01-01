import { QuantityRange } from "@/configurations/data-settings";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
};

export const cartSlice = createSlice({
    name: "cart",
    initialState: initialState,
    reducers: {
        addItemToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.id === newItem.id);

            if (!existingItem) {
                state.items.push({
                    ...newItem,
                    totalItemQuantity: 1,
                });
            } else {
                existingItem.totalItemQuantity += 1;
            }
            state.totalPrice += newItem.price;
            state.totalQuantity += 1;
        },

        setQuantity: (state, action) => {
            const item = state.items.find((item) => item.id === action.payload.id);
            if (item) {
                item.totalItemQuantity = action.payload.quantity;
                state.totalPrice = state.items.reduce((total, item) => total + item.price * item.totalItemQuantity, 0);
                state.totalQuantity = state.items.reduce((total, item) => total + item.totalItemQuantity, 0);
            }
        },

        incrementQuantity: (state, action) => {
            const item = state.items.find((item) => item.id === action.payload);

            if (item) {
                if (item.totalItemQuantity < QuantityRange.max) {
                    item.totalItemQuantity += 1;
                    state.totalPrice += item.price;
                    state.totalQuantity += 1;
                }
            }
        },

        decrementQuantity: (state, action) => {
            const item = state.items.find((item) => item.id === action.payload);

            if (item) {
                if (item.totalItemQuantity > QuantityRange.min) {
                    item.totalItemQuantity -= 1;
                    state.totalPrice -= item.price;
                    state.totalQuantity -= 1;
                }
            }
        },

        removeItemFromCart: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                state.totalPrice -= existingItem.price * existingItem.totalItemQuantity;
                state.totalQuantity -= existingItem.totalItemQuantity;
                state.items = state.items.filter((item) => item.id !== id);
            }
        },

        clearCart: (state) => {
            return initialState;
        },
    },
});

export const { addItemToCart, setQuantity, incrementQuantity, decrementQuantity, removeItemFromCart, clearCart } =
    cartSlice.actions;

export default cartSlice.reducer;
