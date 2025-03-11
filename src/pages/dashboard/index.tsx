import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";

export default function Dashboard () {
	const { language } = useLanguage();
	const translations = language === 'ne' ? neTranslations : enTranslations;

	return (
		<div className="flex justify-center items-center min-h-screen text-3xl">{translations.dashboard.welcome_message}</div>
	);
}

// Once able to connect to database, replace user to it's dynamic value.