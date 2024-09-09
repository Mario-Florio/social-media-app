import "./useTheme.css";
import { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "../useLocalStorage";

const ThemeContext = createContext();

const defaultDarkTheme = {
    "--background-color": "#000000",
    "--primary-color": "#272727",
    "--secondary-color": "#3d3d3d",
    "--target-color": "#9932cc",
    "--hover-color": "#565656",
    "--post-background-color": "#272727",
    "--primary-font-color": "#bdc3c7",
    "--secondary-font-color": "#808080",
    "--box-shadow-color": "transparent",
    "--topbar-box-shadow-color": "#8f8f8f"
};

const defaultTheme = {
    "--background-color": "#ebeef0",
    "--primary-color": "#c8aaaf",
    "--secondary-color": "#d5d5d5",
    "--target-color": "#1e90ff",
    "--hover-color": "#aeaeae",
    "--post-background-color": "#ffffff",
    "--primary-font-color": "#000000",
    "--secondary-font-color": "#808080",
    "--box-shadow-color": "#808080",
    "--topbar-box-shadow-color": "#ffffff"
};

export const ThemeProvider = ({ children }) => {
    const [darkModeIsActive, setDarkModeIsActive] = useLocalStorage("darkmode", false);
    const [darkTheme, setDarkTheme] = useLocalStorage("dark-theme", defaultDarkTheme);
    const [theme, setTheme] = useLocalStorage("theme", defaultTheme);

    useEffect(() => {
        return () => {
            for (const key in defaultTheme) {
                document.body.style.removeProperty(key);
            }
        }
    }, []);

    useEffect(() => {
        if (darkModeIsActive) {
            document.body.classList.add("dark");
            for (const key in darkTheme) {
                document.body.style.setProperty(key, darkTheme[key]);
            }
        } else {
            document.body.classList.remove("dark");
            for (const key in theme) {
                document.body.style.setProperty(key, theme[key]);
            }
        }
    }, [darkModeIsActive, theme, darkTheme]);

    function restoreDefault() {
        setTheme(defaultTheme);
    }

    function restoreDefaultDark() {
        setDarkTheme(defaultDarkTheme);
    }

    const value = {
        darkModeIsActive,
        setDarkModeIsActive,
        theme,
        setTheme,
        restoreDefault,
        darkTheme,
        setDarkTheme,
        restoreDefaultDark
    };

    return(
        <ThemeContext.Provider value={value}>
            <div id="themeProvider">{children}</div>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    return useContext(ThemeContext);
};