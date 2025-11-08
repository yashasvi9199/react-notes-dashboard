import React, {createContext, useEffect, useContext} from "react";
import useLocalStorage from "../hooks/useLocalStorage";

// Create a new context object
const ThemeContext = createContext();

// Create a provider component
export function ThemeProvider({ children }) {

    // Store theme in localStoarage (using our custom hook)
    const [theme, setTheme] = useLocalStorage("theme", "light");

    // useEffect to change Theme and update <html> class for dark mode style
    useEffect( () => {
        const root = document.documentElement;
        if (theme === "dark") root.classList.add("dark");
        else root.classList.remove("dark");
    }, [theme]);

    // A function to toggle the theme
    const toggleTheme = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));

    // Make theme and toggle available to all components
    return(
        <ThemeContext.Provider value={{ theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

// Custom hook to easily use this context anywhere
export function useTheme() {
    return useContext(ThemeContext);
}