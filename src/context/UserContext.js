import React, { useState, createContext, useEffect } from "react";
import { client } from '../utils'

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch current user from DRF `/auth/me` on app load
    const fetchUser = async () => {
        setLoading(true);
        try {
            const data = await client("/api/v1/auth/me");
            setUser(data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
};
    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, fetchUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};
