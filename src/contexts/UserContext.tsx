import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserData {
  name: string;
  email: string;
  avatar?: string;
  cart: {
    items: number;
  };
  isVerified?: boolean;
  aadhaarNumber?: string;
}

interface UserContextType {
  isLoggedIn: boolean;
  userType: "farmer" | "consumer" | null;
  userData: UserData | null;
  login: (isFarmer: boolean, email: string, aadhaarNumber?: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"farmer" | "consumer" | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const login = (isFarmer: boolean, email: string, aadhaarNumber?: string) => {
    setIsLoggedIn(true);
    const type = isFarmer ? "farmer" : "consumer";
    setUserType(type);
    
    // In a real app, this would come from your backend
    const mockUserData = {
      name: isFarmer ? 'Rajesh Mehta' : 'Meera Reddy',
      email: email,
      avatar: isFarmer ? '/avatars/farmer1.jpg' : '/avatars/consumer1.jpg',
      cart: {
        items: 0
      },
      ...(isFarmer && {
        isVerified: !!aadhaarNumber,
        aadhaarNumber
      })
    };
    setUserData(mockUserData);

    // In a real app, you would store the auth token in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userType', type);
    localStorage.setItem('userData', JSON.stringify(mockUserData));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUserData(null);
    
    // Clear stored data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
  };

  // Check for existing login on mount
  React.useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    const storedUserType = localStorage.getItem('userType') as "farmer" | "consumer" | null;
    const storedUserData = localStorage.getItem('userData');

    if (storedIsLoggedIn === 'true' && storedUserType && storedUserData) {
      setIsLoggedIn(true);
      setUserType(storedUserType);
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  return (
    <UserContext.Provider value={{ isLoggedIn, userType, userData, login, logout }}>
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