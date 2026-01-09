import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials } from '@/types/auth';

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default users
const USERS = [
    { username: 'admin', password: 'admin123', role: 'admin' as const, displayName: 'Administrator' },
    { username: 'dataentry', password: 'entry123', role: 'dataentry' as const, displayName: 'Data Entry' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('sigap_auth_user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Failed to parse stored user:', error);
                localStorage.removeItem('sigap_auth_user');
            }
        }
    }, []);

    const login = async (credentials: LoginCredentials): Promise<boolean> => {
        // Simulate async login
        await new Promise(resolve => setTimeout(resolve, 500));

        const foundUser = USERS.find(
            u => u.username === credentials.username && u.password === credentials.password
        );

        if (foundUser) {
            const userData: User = {
                username: foundUser.username,
                role: foundUser.role,
                displayName: foundUser.displayName,
            };
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('sigap_auth_user', JSON.stringify(userData));
            return true;
        }

        return false;
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('sigap_auth_user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
