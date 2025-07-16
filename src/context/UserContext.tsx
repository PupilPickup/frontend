import React, { createContext, useContext, useState } from "react";
import { UserData } from "../schema/types";

// Define the context type
interface UserContextType {
  user: UserData | null;
  login: (user: UserData | null) => void;
  logout: () => void;
  isLoggedIn: boolean;
  isAdmin: () => boolean;
  typeOfParent: () => number;
  typeOfDriver: () => number;
  updateUserRoles: (roles: number[]) => void;
}

// Create the context with an undefined default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const adminRole:number  = Number(process.env.ROLE_ADMIN) || 1;
  const parentRole:number  = Number(process.env.ROLE_PARENT) || 2;
  const pendingParentRole: number = Number(process.env.ROLE_PENDING_PARENT) || 4;
  const driverRole: number = Number(process.env.ROLE_DRIVER) || 3;
  const pendingDriverRole: number = Number(process.env.ROLE_PENDING_DRIVER) || 5;
  const noRole: number = Number(process.env.ROLE_ROLELESS_USER) || 6;
  const rejectedParentRole: number = Number(process.env.ROLE_REJECTED_PARENT) || 7;
  const rejectedDriverRole: number = Number(process.env.ROLE_REJECTED_DRIVER) || 8;

  const [user, setUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Function to login a user
  function login(user: UserData | null):void {
    setUser(user);
    if(user === null){
      setIsLoggedIn(false);
    }else{
      setIsLoggedIn(true);
    }
  }

  // Function to log out the user
  function logout():void {
    setIsLoggedIn(false);
    setUser(null);
    sessionStorage.removeItem("token");
  }

  // Function to check if the user is an admin
  function isAdmin():boolean {
    return user?.roles.includes(adminRole) || false;
  }

  function typeOfParent():number {
    if (user?.roles.includes(parentRole)) {
      return parentRole; // Parent
    }else if (user?.roles.includes(pendingParentRole)) {
      return pendingParentRole; // Pending Parent
    }else if (user?.roles.includes(rejectedParentRole)) {
      return rejectedParentRole; // Rejected Parent
    }else if( user?.roles.includes(adminRole)) {
      return adminRole; // Admin so automatically allowed as Parent
    }else{
      return noRole; // Not a Parent
    }
  }

  function typeOfDriver(): number {
    if (user?.roles.includes(driverRole)) {
      return driverRole; // Driver
    }else if (user?.roles.includes(pendingDriverRole)) {
      return pendingDriverRole; // Pending Driver
    }else if( user?.roles.includes(adminRole)) {
      return adminRole; // Admin so automatically allowed as Driver
    }else if (user?.roles.includes(rejectedDriverRole)) {
      return rejectedDriverRole; // Rejected Driver
    }else{
      return noRole; // Not a Driver
    }
  }

  function updateUserRoles(roles: number[]): void {
    if (user) {
      setUser({ ...user, roles });
    } else {
      console.warn("Cannot update roles, user is not logged in.");
    }
  }

  React.useEffect(() => {
    console.log("User state updated:", user);
  }, [user, isLoggedIn]);

  return (
    <UserContext.Provider value={{ user, isLoggedIn, isAdmin, login, logout, typeOfParent, typeOfDriver, updateUserRoles }}>
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