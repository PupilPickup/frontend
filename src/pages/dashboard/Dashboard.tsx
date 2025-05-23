import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard () {
	const [isLoading, setIsLoading] = useState(true);

	const { language } = useLanguage();
	const translations = language === 'ne' ? neTranslations : enTranslations;

	const navigate = useNavigate();
	const token = sessionStorage.getItem("token");
	const username = sessionStorage.getItem("user_name");
	const userId = sessionStorage.getItem("user_id");
	
	useEffect(() => {
		if(!token || !username || !userId){
			sessionStorage.removeItem("token");
			sessionStorage.removeItem("user_name");
			sessionStorage.removeItem("user_id");
			navigate("/"); 
		}
		setIsLoading(false);
	}, [navigate, token, userId, username]);

	if(isLoading){
		return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.loading}</div>
	}

	if(!token){
		return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.redirecting}</div>
	}

	return (
		<div className="flex flex-col items-center min-h-[90vh] text-3xl my-4 p-4">{translations.dashboard.welcome_message}</div>
	);
}

// Once able to connect to database, replace user to it's dynamic value.