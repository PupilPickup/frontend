import { Routes, Route } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import SignupStep1 from "./signup/SignupStep1";
import SignupStep2 from "./signup/SignupStep2";
import SignupStep3 from "./signup/SignupStep3";
import SignupSuccess from "./signup/SignupSuccess";
import AuthPage from "./Auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useUser } from "../../context/UserContext";

export default function SignUpPage(){
  
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();
  const translations = language === 'ne' ? neTranslations : enTranslations;
  const token = sessionStorage.getItem("token");
  const { user, isLoggedIn } = useUser();

  const navigate = useNavigate();
  useEffect(() => {
    if (!!token && isLoggedIn && !!user) {
      navigate("/dashboard");
    }
    setIsLoading(false);
  }, [isLoggedIn, navigate, user, token]);

  if(isLoading){
		return <div className="flex justify-center items-center min-h-screen">{translations.universal.loading}</div>
	}

	if(isLoggedIn){
		return <div className="flex justify-center items-center min-h-screen">{translations.universal.redirecting}</div>
	}
  
  return (

      <Routes>
        <Route path="/1" element={<AuthLayout><SignupStep1 /></AuthLayout>} />
        <Route path="/2" element={<AuthLayout><SignupStep2 /></AuthLayout>} />
        <Route path="/3" element={<AuthLayout><SignupStep3 /></AuthLayout>} />
        <Route path="/complete" element={<SignupSuccess />} />
        <Route path="/" element={<AuthPage />} />
      </Routes>

  );
}

