import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import SignupStep1 from "./signup/SignupStep1";
import SignupStep2 from "./signup/SignupStep2";
import SignupSuccess from "./signup/SignupSuccess";
import AuthPage from "./Auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


interface SignUpPageProps {
	isLoggedIn: boolean, 
	// setIsLoggedIn:(isLoggedIn: boolean) => void
}

const SignUpPage: React.FC<SignUpPageProps> = ( { isLoggedIn } ) => {
  
  const navigate = useNavigate();
  useEffect(() => {
    if ((!!sessionStorage.getItem("token")) || isLoggedIn) {
      navigate("/dashboard");
    }
  });
  
  return (

      <Routes>
        <Route path="/1" element={<AuthLayout><SignupStep1 /></AuthLayout>} />
        <Route path="/2" element={<AuthLayout><SignupStep2 /></AuthLayout>} />
        <Route path="/complete" element={<SignupSuccess />} />
        <Route path="/" element={<AuthPage isLoggedIn={isLoggedIn} />} />
      </Routes>

  );
}

export default SignUpPage;
