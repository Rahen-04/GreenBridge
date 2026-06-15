import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { authApi, cartApi, UserData } from '@/lib/api';

interface UserContextType {
  isLoggedIn: boolean;
  userType: "farmer" | "consumer" | null;
  userData: UserData | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    role: "farmer" | "consumer";
    aadhaarNumber?: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateCartCount: (count: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"farmer" | "consumer" | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setUser = useCallback((user: UserData) => {
    setIsLoggedIn(true);
    setUserType(user.role);
    setUserData(user);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await authApi.me();
      setUser(data);
    } catch {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUserType(null);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  React.useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login(email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const register = async (registerData: {
    email: string;
    password: string;
    name: string;
    role: "farmer" | "consumer";
    aadhaarNumber?: string;
  }) => {
    const { data } = await authApi.register(registerData);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUserData(null);
    localStorage.removeItem('token');
  };

  const updateCartCount = (count: number) => {
    setUserData((prev) => (prev ? { ...prev, cart: { items: count } } : prev));
  };

  return (
    <UserContext.Provider value={{
      isLoggedIn,
      userType,
      userData,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
      updateCartCount,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export async function syncCartCount(updateCartCount: (count: number) => void) {
  try {
    const { data } = await cartApi.get();
    const count = data.reduce((sum, item) => sum + item.quantity, 0);
    updateCartCount(count);
  } catch {
    // user may not be logged in
  }
}
