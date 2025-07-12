import { createContext, useContext, useEffect, useState } from "react";
import { getUser as getUserFromStorage } from "@/utils/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(getUserFromStorage());

    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("cartItems");
        setUser(null);
    };

    useEffect(() => {
        const storedUser = getUserFromStorage();
        if (storedUser) setUser(storedUser);
    }, []);

    return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
