import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    totalQuantity: 0,
};

export const groupCartSlice = createSlice({
    name: "groupCart",
    initialState: initialState,
    reducers: {
        addItemToGroupCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.id === newItem.id);

            if (!existingItem) {
                state.items.push({
                    ...newItem,
                    totalItemQuantity: 1,
                });
                state.totalQuantity += 1;
            } else {
                existingItem.totalItemQuantity += 1;
                state.totalQuantity += 1;
            }
        },

        incrementQuantity: (state, action) => {
            const item = state.items.find((item) => item.id === action.payload);

            if (item) {
                if (item.totalItemQuantity < 10) {
                    item.totalItemQuantity += 1;
                    state.totalQuantity += 1;
                }
            }
        },

        decrementQuantity: (state, action) => {
            const item = state.items.find((item) => item.id === action.payload);

            if (item) {
                if (item.totalItemQuantity > 1) {
                    item.totalItemQuantity -= 1;
                    state.totalQuantity -= 1;
                }
            }
        },

        removeItemFromGroupCart: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                state.totalPrice -= existingItem.price * existingItem.totalItemQuantity;
                state.totalQuantity -= existingItem.totalItemQuantity;
                state.items = state.items.filter((item) => item.id !== id);
            }
        },

        clearGroupCart: (state) => {
            return initialState;
        },
    },
});

export const { addItemToGroupCart, incrementQuantity, decrementQuantity, removeItemFromGroupCart, clearGroupCart } =
    groupCartSlice.actions;

export default groupCartSlice.reducer;
