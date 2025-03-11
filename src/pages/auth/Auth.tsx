//Page that allows user to sign up or login

import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import WeShare from "../../assets/icons/Weshare.svg";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

export default function AuthPage () {
	const navigate = useNavigate();

	const { language } = useLanguage();
  	const translations = language === 'ne' ? neTranslations : enTranslations;

  const handleSignUpClick = () => {
    navigate("/signup/1");
  };

	const handleLoginClick = () => {
		navigate("/login")
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