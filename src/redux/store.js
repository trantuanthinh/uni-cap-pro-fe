"use client";

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slicers/userSlice";

// Function to load the persisted state from localStorage
function loadState() {
    if (typeof window === "undefined") {
        // If window is undefined, we're on the server, so return undefined
        return undefined;
    }

    try {
        const serializedState = localStorage.getItem("state");
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
            localStorage.setItem("state", serializedState);
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
    },
    preloadedState: persistedState, // Use the persisted state as the initial state
});

// Subscribe to store updates and save the state to localStorage
store.subscribe(() => {
    saveState(store.getState());
});