import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    totalQuantity: 0,
};

export const checkoutSlice = createSlice({
    name: "checkout",
    initialState: initialState,
    reducers: {
        addItemToCheckout: (state, action) => {
            const newItem = action.payload;

            state.items.push({
                ...newItem,
                cart_type: newItem?.cart_type, // client added product from "cart" or "shared_cart"
                order_type: newItem?.order_type, // client choose order type: "individual", "shared_group", "join_group"
            });
            state.totalQuantity += 1;
        },

        removeItemFromCheckout: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                state.items = state.items.filter((item) => item.id !== id);
                state.totalQuantity -= 1;
            }
        },

        resetCheckoutCart: (state) => {
            return initialState;
        },
    },
});

export const { addItemToCheckout, removeItemFromCheckout, resetCheckoutCart } = checkoutSlice.actions;

export default checkoutSlice.reducer;
