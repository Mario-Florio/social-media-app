import { createContext, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

import requests from "../serverRequests/requests";
const { getSession } = requests.auth;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage("user", null);
    const [token, setToken] = useLocalStorage("token", null);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            token ? await getSession(token)
                .then(async data => {
                    if (data.success) {
                        setUser(data.user);
                    } else {
                        setUser(null);
                        setToken(null);
                    }
                })
                .catch(err => console.log(err)) :
            setUser(null);
        })();
    }, []);

    const login = async (data) => {
        setUser(data.user);
        setToken(data.token);
        navigate("/");
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        navigate("/login", { replace: true });
    }

    const updateUser = (user) => {
        setUser(user);
    }

    const updateToken = (token) => {
        setToken(token);
    }

    const value = useMemo(() => ({
        user,
        token,
        login,
        logout,
        updateUser,
        updateToken
    }),
    [user, token]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
