// src/redux/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            return action.payload;
        },
        clearUser: () => {
            return null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
