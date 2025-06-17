import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// Define the structure of the user data
interface UserData {
  username: string;
  userId: string;
  isAdmin: boolean;
  isParent: boolean;
  isDriver: boolean;
  isPendingParent: boolean;
  isPendingDriver: boolean;
}

// Define the context type
interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  logout: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

// Create the context with an undefined default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  // Function to log out the user
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  React.useEffect(() => {
    console.log("User state updated:", user);
  }, [user, isLoggedIn]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};