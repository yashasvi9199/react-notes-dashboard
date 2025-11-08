import React from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

function ThemeTester() {
    const {theme, toggleTheme} = useTheme();

    return(
        <div style={{
            padding: "20px", background: theme ==="dark" ? "#0f172a" : "#f1f5f9",
            color: theme === "dark" ? "#f8fafc" : "#0f172a", minHeight: "100vh"
        }}>
            <h1>Current Theme: {theme}</h1>
            <button onClick={toggleTheme}>
                Switch to {theme === "dark" ? "Light" : "Dark"} Mode
            </button>
        </div>
    );
}

// Creating Wrapper
export default function TestTheme() {
    return(
        <ThemeProvider>
            <ThemeTester />
        </ThemeProvider>
    )
}