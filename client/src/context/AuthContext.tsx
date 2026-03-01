'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/firebaseApp';
import {
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import { UserData } from '@/types';

interface AuthContextType {
    user: FirebaseUser | null;
    userData: UserData | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<FirebaseUser>;
    signUp: (email: string, password: string, displayName: string, role?: string) => Promise<FirebaseUser>;
    signOut: () => Promise<void>;
    isOrganizer: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                const token = await firebaseUser.getIdToken();

                try {
                    const response = await fetch('/api/users/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const profile: UserData = await response.json();
                        setUserData(profile);
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }

                setUser(firebaseUser);
            } else {
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string): Promise<FirebaseUser> => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const token = await result.user.getIdToken();

            try {
                const response = await fetch('/api/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const profile: UserData = await response.json();
                    setUserData(profile);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }

            return result.user;
        } catch (error) {
            throw error;
        }
    };

    const signUp = async (
        email: string,
        password: string,
        displayName: string,
        role: string = 'registered_user'
    ): Promise<FirebaseUser> => {
        try {
            // Register through backend
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, displayName, role })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Registration failed');
            }

            // Then sign in
            return await signIn(email, password);
        } catch (error) {
            throw error;
        }
    };

    const signOut = async (): Promise<void> => {
        try {
            await firebaseSignOut(auth);
            setUser(null);
            setUserData(null);
        } catch (error) {
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        userData,
        loading,
        signIn,
        signUp,
        signOut,
        isOrganizer: userData?.role === 'event_organizer' || userData?.role === 'system_admin',
        isAdmin: userData?.role === 'system_admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
