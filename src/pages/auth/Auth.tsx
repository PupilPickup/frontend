//Page that allows user to sign up or login

import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import WeShare from "../../assets/icons/Weshare.svg";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";

const AuthPage: React.FC = () => {

	const [isLoading, setIsLoading] = useState(true);
	
	const navigate = useNavigate();
	const { user } = useUser();

	const { language } = useLanguage();
	const translations = language === 'ne' ? neTranslations : enTranslations;

	const handleSignUpClick = () => {
		navigate("/signup/1");
	};

	const handleLoginClick = () => {
		navigate("/login")
	};

	useEffect(() => {
		if ((!!sessionStorage.getItem("token") && !!user)) {
			navigate("/dashboard");
		}
		setIsLoading(false);
	}, [user]);

	if(isLoading){
		return <div className="flex justify-center items-center min-h-screen">{translations.universal.loading}</div>
	}

	if(!!user){
		return <div className="flex justify-center items-center min-h-screen">{translations.universal.redirecting}</div>
	}

	return (
		<div className='flex flex-col min-h-screen mx-2'>
			{/* Logo */}
			<div className="flex-grow flex justify-center items-center">
				<img src={WeShare} alt={translations.auth.alt_logo_text} />
			</div>

			{/* Buttons */}
			<div className="flex flex-col gap-2 justify-evenly pb-24">
				<Button 
					label={translations.auth.login}
					variant="primary" 
					onClick={handleLoginClick}
					className="w-full p-2 rounded-md" /> 
				<Button 
					label={translations.auth.sign_up}
					variant="secondary" 
					onClick={handleSignUpClick}
					className="w-full p-2 rounded-md" />
			</div>
		</div>	
	);
}

export default AuthPage;