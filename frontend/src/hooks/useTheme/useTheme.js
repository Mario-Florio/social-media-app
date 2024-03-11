import "./useTheme.css";
import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../useLocalStorage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkModeIsActive, setDarkModeIsActive] = useLocalStorage("darkmode");

    const value = {
        darkModeIsActive,
        setDarkModeIsActive
    };

    return(
        <ThemeContext.Provider value={value}>
            <div className={ darkModeIsActive ? "themeProvider dark" : "themeProvider" }>
                {children}
            </div>
        </ThemeContext.Provider>);
};

export const useTheme = () => {
    return useContext(ThemeContext);
};