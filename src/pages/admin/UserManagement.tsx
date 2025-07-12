import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import HelpTip from "../../components/common/HelpTip";
import UserTable from "../../components/UserTable";
import { useUser } from "../../context/UserContext";
import { PartialProfileData } from "../../schema/types";
import { UserServerErrors } from "../../schema/serverErrorTypes";

export default function UserManagement () {
    const [isLoading, setIsLoading] = useState(true);
    const [userList, setUserList] = useState<PartialProfileData[]>([]);
    const [displayUserList, setDisplayUserList] = useState<PartialProfileData[]>([]);
    const [serverError, setServerError] = useState<string>("");

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    const navigate = useNavigate();
    const token: string | null = sessionStorage.getItem("token");
    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const pendingParentId: number = Number(process.env.ROLE_PENDING_PARENT_ID) || 4;
    const pendingDriverId: number = Number(process.env.ROLE_PENDING_DRIVER_ID) || 5; 

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

        async function populateUserList(token:string, userName:string, userId:string){
            try {
                const response = await axios.get(`${apiUrl}/users`, {
                    headers: {
                        Authorization: "Bearer " + token,
                        user_name: userName,
                        user_id: userId,
                    },
                });
                const retrievedUsers = response.data;
                setUserList(retrievedUsers);
                setIsLoading(false);
                setServerError("");

            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    const errorKey = error.response.data.error as UserServerErrors;
                    let errorMessage: string = "TODO";
                    setServerError(errorMessage);
                }
                setIsLoading(false);
            }
        }

        populateUserList(token!, user!.username, user!.userId);
        setDisplayUserList(userList);
        setIsLoading(false);
    }, [token, user, isLoggedIn, logout, navigate, isAdmin, apiUrl, userList, displayUserList, translations.children_server_errors]);


    function filterPendingParents(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const isChecked = event.target.checked;
        if (isChecked) {
            const filteredUsers = userList.filter(user => user.roles.includes(pendingParentId));
            setDisplayUserList(filteredUsers);
        } else {
            setDisplayUserList(userList);
        }
    }

    function filterPendingDrivers(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const isChecked = event.target.checked;
        if (isChecked) {
            const filteredUsers = userList.filter(user => user.roles.includes(pendingDriverId));
            setDisplayUserList(filteredUsers);
        } else {
            setDisplayUserList(userList);
        }
    }

    if(isLoading){
        return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.loading}</div>
    }

    if(!token){
        return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.redirecting}</div>
    }

    return (
        <div className="flex flex-col items-center min-h-[90vh] w-full my-4 px-4">
            <div className="flex justify-start w-full">
                <HelpTip content={translations.help.user_search} altText={translations.universal.help_icon}/>
            </div>
            <h1 className="text-3xl font-bold mb-4">{translations.users.header}</h1>
            <h2>{translations.users.users_prompt}</h2>
            {serverError && <div className="text-red-500 mb-4">{serverError}</div>}
            <div className="">
                <div className="flex flex-row mb-2 sm:w-[50%]">
                    <p className="">{translations.users.filter}</p>
                </div>
                <div className="flex flex-row mb-2 sm:w-[50%]">
                    <input
                        type="checkbox"
                        id="pendingParentInput"
                        onChange={filterPendingParents}
                    />
                    <label htmlFor="pendingParentInput" className="ml-1">
                        {translations.users.pending_parents}
                    </label>
                </div>
                <div className="flex flex-row mb-2 sm:w-[50%]">
                    <input
                        type="checkbox"
                        id="pendingDriverInput"
                        onChange={filterPendingDrivers}
                    />
                    <label htmlFor="pendingDriverInput" className="ml-1">
                        {translations.users.pending_drivers}
                    </label>
                </div>
            </div>
            <UserTable userList={displayUserList} />
        </div>
    );
}