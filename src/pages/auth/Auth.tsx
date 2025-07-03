//Page that allows user to sign up or login

import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import WeShare from "../../assets/icons/Weshare.svg";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";

export default function AuthPage() {
	const [isLoading, setIsLoading] = useState(true);
	
	const navigate = useNavigate();

	const { language } = useLanguage();
	const translations = language === 'ne' ? neTranslations : enTranslations;
	const { user, isLoggedIn } = useUser();
	const token = sessionStorage.getItem("token");

	const handleSignUpClick = () => {
		navigate("/signup/1");
	};

	const handleLoginClick = () => {
		navigate("/login")
	};

	useEffect(() => {
		if(!!token && !!user && isLoggedIn) {
			navigate("/dashboard");
		}
		setIsLoading(false);
	}, [isLoggedIn, navigate, token, user]);

	if(isLoading){
		return <div className="flex justify-center items-center min-h-screen">{translations.universal.loading}</div>
	}

	if(isLoggedIn){
		return <div className="flex justify-center items-center min-h-screen">{translations.universal.redirecting}</div>
	}

	return (
		<div className='flex flex-col min-h-[67vh] mx-2'>
			{/* Logo */}
			<div className="flex-grow flex justify-center items-center">
				<img src={WeShare} alt={translations.auth.alt_logo_text} />
			</div>

			{/* Buttons */}
			<div className="flex flex-col gap-2 items-center pb-24 px-4">
				<Button 
					label={translations.auth.login}
					variant="primary" 
					onClick={handleLoginClick}
					className="w-full p-2 rounded-md sm:max-w-[50%]" /> 
				<Button 
					label={translations.auth.sign_up}
					variant="primary" 
					onClick={handleSignUpClick}
					className="w-full p-2 rounded-md sm:max-w-[50%]" />
			</div>
		</div>	
	);
}