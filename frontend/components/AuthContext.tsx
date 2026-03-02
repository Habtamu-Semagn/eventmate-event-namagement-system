'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    email: string | null;
    uid: string;
}

interface UserData {
    displayName: string | null;
    role: string;
    email: string | null;
}

interface AuthContextType {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName: string, role: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored auth state
        const storedUser = localStorage.getItem('eventmate_user');
        const storedUserData = localStorage.getItem('eventmate_user_data');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
        setLoading(false);
    }, []);

    const signIn = async (email: string, password: string) => {
        // Simulated sign in - in real app, this would call Firebase/auth API
        const mockUser: User = { email, uid: 'user_' + Date.now() };
        const mockUserData: UserData = {
            displayName: email.split('@')[0],
            role: 'registered_user',
            email
        };

        setUser(mockUser);
        setUserData(mockUserData);
        localStorage.setItem('eventmate_user', JSON.stringify(mockUser));
        localStorage.setItem('eventmate_user_data', JSON.stringify(mockUserData));
    };

    const signUp = async (email: string, password: string, displayName: string, role: string) => {
        const mockUser: User = { email, uid: 'user_' + Date.now() };
        const mockUserData: UserData = {
            displayName,
            role,
            email
        };

        setUser(mockUser);
        setUserData(mockUserData);
        localStorage.setItem('eventmate_user', JSON.stringify(mockUser));
        localStorage.setItem('eventmate_user_data', JSON.stringify(mockUserData));
    };

    const signOut = async () => {
        setUser(null);
        setUserData(null);
        localStorage.removeItem('eventmate_user');
        localStorage.removeItem('eventmate_user_data');
    };

    return (
        <AuthContext.Provider value={{ user, userData, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
