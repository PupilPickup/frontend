import React, { createContext, useContext, useState } from "react";

// Define the structure of the signup data
interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
}

// Define the context type, allowing partial updates to signup data
interface SignupContextType {
  signupData: SignupData;
  setSignupData: (data: Partial<SignupData>) => void;
}

// Create the context with an undefined default value
const SignupContext = createContext<SignupContextType | undefined>(undefined);

// Provider component
export const SignupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signupData, setSignupData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
  });

  // Function to update signup data with partial updates
  const updateSignupData = (data: Partial<SignupData>) => {
    setSignupData((prev) => ({ ...prev, ...data }));
  };

  return (
    <SignupContext.Provider value={{ signupData, setSignupData: updateSignupData }}>
      {children}
    </SignupContext.Provider>
  );
};

// Custom hook to use the SignupContext
export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignup must be used within a SignupProvider");
  }
  return context;
};