import { createContext, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

import axios from "axios";
import getData from "../dummyData";

const { users } = getData();

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage("user", null);
    const [token, setToken] = useLocalStorage("token", "token");
    const navigate = useNavigate();

    // localStorage.removeItem("token");

    useEffect(() => {
        token ? getSession()
            .then(async data => {
                if (data.success) {
                    setUser(data.authData.user);
                } else {
                    setUser(null);
                    setToken(null);
                }
            })
            .catch(err => console.log(err)) :
        setUser(null);

        async function getSession() {
            // const config = {
            //     headers: {
            //         Authorization: `Bearer ${token}`
            //     }
            // }
            // const session = await axios.get("/auth/session", config);
            // return session.data;
            return {
                authData: {
                    user: users[1]
                },
                token: "",
                success: true
            }
        }
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

    const value = useMemo(() => ({
            user,
            token,
            login,
            logout,
        }),
        [user, token]);
        
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
