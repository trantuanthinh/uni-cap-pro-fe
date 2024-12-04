import { QuantityRange } from "@/configurations/data-settings";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

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

        setQuantity: (state, action) => {
            const item = state.items.find((item) => item.id === action.payload.id);
            if (item) {
                item.totalItemQuantity = action.payload.quantity;
                state.totalQuantity = state.items.reduce((total, item) => total + item.totalItemQuantity, 0);
            }
        },

        incrementQuantity: (state, action) => {
            const item = state.items.find((item) => item.id === action.payload);

            if (item) {
                if (item.totalItemQuantity < QuantityRange.max) {
                    item.totalItemQuantity += 1;
                    state.totalQuantity += 1;
                }
            }
        },

        decrementQuantity: (state, action) => {
            const item = state.items.find((item) => item.id === action.payload);

            if (item) {
                if (item.totalItemQuantity > QuantityRange.min) {
                    item.totalItemQuantity -= 1;
                    state.totalQuantity -= 1;
                }
            }
        },

        removeItemFromGroupCart: (state, action) => {
            toast.success("Removed from Group Cart");
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

export const {
    addItemToGroupCart,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    removeItemFromGroupCart,
    clearGroupCart,
} = groupCartSlice.actions;

export default groupCartSlice.reducer;
