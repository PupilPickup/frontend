import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";
import WeShare from "../../../assets/icons/Weshare.svg";
import enTranslations from "../../../languages/en.json";
import neTranslations from "../../../languages/ne.json";
import { useLanguage } from "../../../context/LanguageContext";

export default function SignupSuccess () {

	const navigate = useNavigate();
	
	const { language } = useLanguage();
	const translations = language === 'ne' ? neTranslations : enTranslations;

	const handleLoginClick = () => {
    navigate("/login"); 
  };

	return (
		<div className="p-4 flex flex-col items-center">
			<div className="flex justify-center">
				<img src={WeShare} alt={translations.sign_up.alt_logo_text} />
			</div>
			<header className="flex flex-col text-center mb-6 gap-4">
				<h1 className="text-3xl font-bold">{translations.sign_up.success_header}</h1>
				<p className="text-sm w-3/4 mx-auto">{translations.sign_up.thanks_message}</p>
				<p className="text-sm max-w-[400px] mx-auto">{translations.sign_up.commitment_message}</p>
			</header>
			<Button 
				label={translations.sign_up.login_button}
				variant="primary"
				className="w-full sm:max-w-[50%] p-2 rounded-md"
				type="button"
				onClick={handleLoginClick}
			/>
		</div>
	);
}