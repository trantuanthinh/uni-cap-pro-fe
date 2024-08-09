// src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        setUser: (state, action) => action.payload,
        clearUser: () => null
    }
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
