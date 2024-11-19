import { createContext, useContext, useState } from "react";

// Interface for the CategoryItem
const categoryItem = {
    MainCategoryId: null,
    Categories: [],
};

// Create the Unified Context
const AppContext = createContext();

// Unified Context Provider
export const AppProvider = ({ children }) => {
    // Theme-related state and logic
    const [theme, setTheme] = useState("light");
    const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

    // User-related state and logic
    const [user, setUser] = useState(null);
    const login = (data) => setUser(data);
    const logout = () => setUser(null);

    // Main Categories-related state and logic
    const [mainCategories, setMainCategories] = useState([]);
    const updateMainCategories = (data) => setMainCategories(data);
    const clearMainCategories = () => setMainCategories(null);

    // Categories-related state and logic
    const [categories, setCategories] = useState([]);
    const updateCategories = (data) => setCategories(data);
    const clearCategories = () => setCategories(null);

    // Category Items-related state and logic
    const [categoryItems, setCategoryItems] = useState([]);
    const updateCategoryItems = (data) => setCategoryItems(data);
    const clearCategoryItems = () => setCategoryItems(null);

    return (
        <AppContext.Provider
            value={{
                theme,
                toggleTheme,
                user,
                login,
                logout,
                mainCategories,
                updateMainCategories,
                clearMainCategories,
                categories,
                updateCategories,
                clearCategories,
                categoryItems,
                updateCategoryItems,
                clearCategoryItems,
            }}>
            {children}
        </AppContext.Provider>
    );
};

// Hook to use the AppContext
export const useAppContext = () => useContext(AppContext);
