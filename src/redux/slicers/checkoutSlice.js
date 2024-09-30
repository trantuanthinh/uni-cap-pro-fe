import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
};

export const checkoutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers: {
        addItemToCheckout: (state, action) => {
            const newItem = action.payload;
            console.log("🚀 ~ action:", action);
            console.log("🚀 ~ action.payload:", action.payload);

            // state.items.push({
            //     ...newItem,
            // });
        },

        removeItemFromCheckout: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                state.items = state.items.filter((item) => item.id !== id);
            }
        },

        resetCheckoutCart: (state) => {
            return initialState;
        },
    },
});

export const { addItemToCheckout, removeItemFromCheckout, resetCheckoutCart } = checkoutSlice.actions;

export default checkoutSlice.reducer;
