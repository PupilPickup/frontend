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

const SignUpPage: React.FC = ( ) => {
  
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();
  const translations = language === 'ne' ? neTranslations : enTranslations;

  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if ((!!sessionStorage.getItem("token") && !!user)) {
      navigate("/dashboard");
    }
    setIsLoading(false);
  }, [user, navigate]);

  if(isLoading){
		return <div className="flex justify-center items-center min-h-screen">{translations.universal.loading}</div>
	}

	if(!!user){
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

export default SignUpPage;
