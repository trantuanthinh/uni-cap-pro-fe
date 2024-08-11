"use client";

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slicers/userSlice";
import cartReducer from "./slicers/cartSlice";

// Function to load the persisted state from localStorage
function loadState() {
    if (typeof window === "undefined") {
        // We're on the server, return undefined
        return undefined;
    }

    try {
        const serializedState = localStorage.getItem("user");
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error("Could not load state from localStorage:", err);
        return undefined;
    }
}

// Function to save the state to localStorage
function saveState(state) {
    if (typeof window !== "undefined") {
        try {
            const serializedState = JSON.stringify(state);
            localStorage.setItem("user", serializedState);
        } catch (err) {
            console.error("Could not save state to localStorage:", err);
        }
    }
}

// Load the persisted state
const persistedState = loadState();

// Configure the Redux store with the persisted state
export const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
    },
    preloadedState: persistedState,
});

// Subscribe to store updates and save the state to localStorage
store.subscribe(() => {
    // Ensure only the client environment triggers this
    if (typeof window !== "undefined") {
        saveState(store.getState());
    }
});
