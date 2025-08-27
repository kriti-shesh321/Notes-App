import { createContext, useContext, useState } from "react";

const AuthCtx = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    const login = (t) => {
        setToken(t);
        localStorage.setItem("token", t);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthCtx.Provider
            value={{
                token,
                login,
                logout
            }}>
            {children}
        </AuthCtx.Provider>
    );
};

export { AuthCtx as default, AuthProvider };  
