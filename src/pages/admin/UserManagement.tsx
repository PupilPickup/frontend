import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../components/common/Button";
import HelpTip from "../../components/common/HelpTip";
import UserTable from "../../components/UserTable";
import { useUser } from "../../context/UserContext";

// Define the possible error keys
type PendingServerErrors = 'empty_fields' | 'server_error_post' | 'server_error_put' | 'server_error_delete' | 'generic_error';

export default function UserManagement () {
    const [isLoading, setIsLoading] = useState(true);
    const [pendingUserList, setPendingUserList] = useState([]);
    const [serverError, setServerError] = useState<string>("");

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    const { user, logout, isAdmin, isLoggedIn } = useUser();

    useEffect(() => {
        if(!token || !isLoggedIn || user === null || user === undefined){
            sessionStorage.removeItem("token");
            logout();
            navigate("/"); 
        }

        if(!isAdmin()){
            navigate("/dashboard");
        }

        async function populatePendingList(token:string, userName:string, userId:string){
            try {
                const response = await axios.get(`${apiUrl}/TODO`, {
                    headers: {
                        Authorization: "Bearer " + token,
                        user_name: userName,
                        user_id: userId,
                    },
                });
                const retrievedUsers = response.data;
                setPendingUserList(retrievedUsers);
                setIsLoading(false);
                setServerError("");

            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    const errorKey = error.response.data.error as PendingServerErrors;
                    let errorMessage: string = "TODO";
                    setServerError(errorMessage);
                }
                setIsLoading(false);
            }
        }

        populatePendingList(token!, user!.username, user!.userId);
        setIsLoading(false);
    }, [token, user, isLoggedIn, logout, navigate, apiUrl, translations.children_server_errors]);


    if(isLoading){
        return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.loading}</div>
    }

    if(!token){
        return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.redirecting}</div>
    }

    return (
        <div className="flex flex-col items-center min-h-[90vh] w-full my-4 px-4">
            <div className="flex justify-start w-full">
                <HelpTip content={translations.help.view_children} altText={translations.universal.help_icon}/>
            </div>
            <h1 className="text-3xl font-bold mb-4">{translations.children.children_header}</h1>
            <h2>{translations.children.children_prompt}</h2>
            {serverError && <div className="text-red-500 mb-4">{serverError}</div>}
            <UserTable pendingUserList={pendingUserList} tableType='pending' />
        </div>
    );
}