import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('farmai_token');
        if (token) {
            api.getMe()
                .then(u => setUser(u))
                .catch(() => localStorage.removeItem('farmai_token'))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        const data = await api.login({ username, password });
        localStorage.setItem('farmai_token', data.token);
        setUser(data.user);
        return data.user;
    };

    const register = async (formData) => {
        const data = await api.register(formData);
        localStorage.setItem('farmai_token', data.token);
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem('farmai_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
