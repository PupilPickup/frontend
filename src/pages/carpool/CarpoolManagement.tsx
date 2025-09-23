import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import HelpTip from "../../components/common/HelpTip";
import { useUser } from "../../context/UserContext";

export default function CarpoolManagement () {
    const [isLoading, setIsLoading] = useState(true);
    const [viewState, setViewState] = useState<'my_carpool' | 'my_passengers' | 'carpool_applications'>('my_carpool');

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    const navigate = useNavigate();
    const token: string | null = sessionStorage.getItem("token");
    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const approvedDriverId: number = Number(process.env.ROLE_APPROVED_DRIVER_ID) || 3;

    const { user, logout, isAdmin, typeOfDriver, isLoggedIn } = useUser();

    // --- TAB LABELS ---
    const tabs = [
        { key: 'my_carpool', label: translations.carpool.my_carpool_tab },
        { key: 'my_passengers', label: translations.carpool.my_passengers_tab },
        { key: 'carpool_applications', label: translations.carpool.carpool_applications_tab }
    ];

    useEffect(() => {
        if(!token || !isLoggedIn || user === null || user === undefined){
            sessionStorage.removeItem("token");
            logout();
            navigate("/");
            return;
        }

        if(!isAdmin() && typeOfDriver() !== Number(approvedDriverId)){
            navigate("/dashboard");
            return;
        }

        // Set the initial display user list to the full user list except for the current user
        setIsLoading(false);
    }, [token, user, isLoggedIn, logout, navigate, isAdmin, typeOfDriver, approvedDriverId, apiUrl, translations.children_server_errors]);


    if(isLoading){
        return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.loading}</div>
    }

    if(!token){
        return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.redirecting}</div>
    }

    return (
        <div className="flex flex-col items-center min-h-[90vh] w-full my-4 px-4">
            <div className="flex justify-start w-full">
                <HelpTip content={translations.help.carpool_management} altText={translations.universal.help_icon}/>
            </div>
            <h1 className="text-3xl font-bold mb-4">{translations.carpool.management_header}</h1>
            
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-300 mb-6 w-full max-w-2xl">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        className={`py-2 px-4 -mb-px font-semibold border-b-2 transition-colors duration-200
                            ${viewState === tab.key
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-blue-600"}
                        `}
                        onClick={() => setViewState(tab.key as typeof viewState)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {viewState === 'my_carpool' && (
                <div>
                    <h2 className="text-2xl font-semibold mb-2">{translations.carpool.my_carpool_tab}</h2>
                    {/* My Carpool Component */}
                    
                </div>
            )}
            {viewState === 'my_passengers' && (
                <div>
                    <h2 className="text-2xl font-semibold mb-2">{translations.carpool.my_passengers_tab}</h2>
                    {/* My Passengers Component */}
                    {/* TODO */}
                </div>
            )}
            {viewState === 'carpool_applications' && (
                <div>
                    <h2 className="text-2xl font-semibold mb-2">{translations.carpool.carpool_applications_tab}</h2>
                    {/* Carpool Applications Component */}
                    {/* Steve's Part Here */}
                </div>
            )}  
        </div>
    );
}