// src/redux/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => action.payload,
        clearUser: () => initialState,
    },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;

