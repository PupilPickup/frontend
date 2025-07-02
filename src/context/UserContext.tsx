import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../schema/types";

// Define the context type
interface UserContextType {
  user: UserData | null;
  login: (user: UserData | null) => void;
  logout: () => void;
  isLoggedIn: boolean;
  isAdmin: () => boolean;
  typeOfParent: () => string;
  typeOfDriver: () => string;
}

// Create the context with an undefined default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const adminRole = process.env.ROLE_ADMIN || "1";
  const parentRole = process.env.ROLE_PARENT || "2";
  const pendingParentRole = process.env.ROLE_PENDING_PARENT || "4";
  const driverRole = process.env.ROLE_DRIVER || "3";
  const pendingDriverRole = process.env.ROLE_PENDING_DRIVER || "5";

  const [user, setUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  // Function to login a user
  function login(user: UserData | null):void {
    setUser(user);
    if(user === null){
      setIsLoggedIn(false);
      // navigate("/");
    }else{
      setIsLoggedIn(true);
      navigate("/dashboard");
    }
  }

  // Function to log out the user
  function logout():void {
    setIsLoggedIn(false);
    setUser(null);
    sessionStorage.removeItem("token");
    navigate("/login");
  }

  // Function to check if the user is an admin
  function isAdmin():boolean {
    return user?.roles.includes(adminRole) || false;
  }

  function typeOfParent():string {
    if (user?.roles.includes(parentRole)) {
      return parentRole; // Parent
    }else if (user?.roles.includes(pendingParentRole)) {
      return pendingParentRole; // Pending Parent
    }else if( user?.roles.includes(adminRole)) {
      return adminRole; // Admin so automatically allowed as Parent
    }else{
      return "-1"; // Not a Parent
    }
  }

  function typeOfDriver(): string {
    if (user?.roles.includes(driverRole)) {
      return driverRole; // Driver
    }else if (user?.roles.includes(pendingDriverRole)) {
      return pendingDriverRole; // Pending Driver
    }else if( user?.roles.includes(adminRole)) {
      return adminRole; // Admin so automatically allowed as Driver
    }else{
      return "-1"; // Not a Driver
    }
  }

  React.useEffect(() => {
    console.log("User state updated:", user);
  }, [user, isLoggedIn]);

  return (
    <UserContext.Provider value={{ user, isLoggedIn, isAdmin, login, logout, typeOfParent, typeOfDriver }}>
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