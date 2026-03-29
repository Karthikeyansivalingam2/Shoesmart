import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = async (userData) => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userData.email, password: userData.password })
            });
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Backend doesn't provide avatar by default, but UI expects it
            const userObj = {
                ...data,
                avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
                id: data._id
            };
            
            setUser(userObj);
            localStorage.setItem('user', JSON.stringify(userObj));
            return userObj;
        } catch (error) {
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: userData.name, 
                    email: userData.email, 
                    password: userData.password 
                })
            });
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            const userObj = {
                ...data,
                avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
                id: data._id
            };
            
            setUser(userObj);
            localStorage.setItem('user', JSON.stringify(userObj));
            return userObj;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const directLogin = (userData) => {
        const userObj = {
            ...userData,
            role: userData.role || 'customer',
            id: userData.id || Date.now().toString(),
            token: 'mock-admin-token-' + Date.now()
        };
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, directLogin, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
