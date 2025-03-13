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
	
	useEffect(() => {
		if(!token){
			navigate("/"); 
		}
		setIsLoading(false);
	}, []);

	if(isLoading){
		return <div className="flex justify-center items-center min-h-screen">Loading...</div>
	}

	if(!token){
		return <div className="flex justify-center items-center min-h-screen">Redirecting...</div>
	}

	return (
		<div className="flex justify-center items-center min-h-screen text-3xl">{translations.dashboard.welcome_message}</div>
	);
}

// Once able to connect to database, replace user to it's dynamic value.