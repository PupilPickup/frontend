import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ChildCard from "../../components/ChildCard";
import axios from "axios";
import Button from "../../components/common/Button";
import HelpTip from "../../components/common/HelpTip";
import { useUser } from "../../context/UserContext";
import PendingPromptModal from "../../components/common/PendingPromptModal";

// Define the possible error keys
type ChildrenServerErrors = 'empty_fields'| 'firstname_length' | 'lastname_length' | 'school_arrival_time_invalid' | 'school_departure_time_invalid' | 'server_error_get' | 'server_error_post' | 'server_error_put' | 'server_error_delete' | 'generic_error';

export default function ChildrenManagement() {
    const [isLoading, setIsLoading] = useState(true);
    const [childrenList, setChildrenList] = useState([]);
    const [serverError, setServerError] = useState<string>("");
    const [showRegisterPrompt, setShowRegisterPrompt] = useState<boolean>(false);
    const [showPendingWarning, setShowPendingWarning] = useState<boolean>(false);

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    const navigate = useNavigate();
    const token: string | null = sessionStorage.getItem("token");
    const { user, logout, isLoggedIn, typeOfParent, updateUserRoles } = useUser();
    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    // const adminRole:number  = Number(process.env.ROLE_ADMIN) || 1;
    // const parentRole:number  = Number(process.env.ROLE_PARENT) || 2;
    const pendingParentRole: number = Number(process.env.ROLE_PENDING_PARENT) || 4;
    const noRole: number = Number(process.env.ROLE_ROLELESS_USER) || 6;
    const rejectedParentRole: number = Number(process.env.ROLE_REJECTED_PARENT) || 7;

    useEffect(() => {
        if(!token || user === null || user === undefined || !isLoggedIn){
            sessionStorage.removeItem("token");
            logout();
            navigate("/"); 
            return;
        }

        async function populateChildren(token:string, userName:string, userId:string){
            try {
                const response = await axios.get(`${apiUrl}/children`, {
                    headers: {
                        Authorization: "Bearer " + token,
                        user_name: userName,
                        user_id: userId,
                    },
                });
                const childrenRetrieved = response.data;
                setChildrenList(childrenRetrieved);
                setIsLoading(false);
                setServerError("");

            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    const errorKey = error.response.data.error as ChildrenServerErrors;
                    let errorMessage: string = translations.children_server_errors[errorKey] ?? translations.children_server_errors.generic_error;
                    setServerError(errorMessage);
                }
                setIsLoading(false);
            }
        }
        if(typeOfParent() === noRole){
            setShowRegisterPrompt(true);
        }

        if(typeOfParent() === pendingParentRole){
            setShowPendingWarning(true);
        }

        populateChildren(token!,user!.username, user!.userId);
        setIsLoading(false);
    }, [token, user, logout, isLoggedIn, navigate, apiUrl, typeOfParent, noRole, pendingParentRole, translations.children_server_errors]);

    async function deleteChildData(token:string, userName:string, userId:string, childId:string) {
        try {
            await axios.delete(`${apiUrl}/children/${childId}`, {
                headers: {
                    Authorization: "Bearer " + token,
                    user_name: userName,
                    user_id: userId,
                },
            });
            // Filter out the deleted child from the childrenList
            setChildrenList((prevChildrenList) =>
                prevChildrenList.filter((child: any) => child.childId !== childId)
            );
            setServerError("");

        }catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorKey = error.response.data.error as ChildrenServerErrors;
                let errorMessage: string = translations.children_server_errors[errorKey] ?? translations.children_server_errors.generic_error;
                setServerError(errorMessage);
            }
        }
    }

    function editChild(childId: string) {
        // Handle edit action here
        navigate(`/my-children/edit-child-data/${childId}`);
    }

    function deleteChild(childId: string) {
        // TODO make user verify choice
        // Handle delete action here
        if(!!token && !!user){
            deleteChildData(token, user.username, user.userId, childId);
        }
        // TODO success message
    }

    function handleAddClick(){
        navigate("/my-children/add-child-data")
    }

    function removeSeconds(timeString: string){
        const sections = timeString.split(":")
        return sections[0] + ":" + sections[1];
    }

    function handleAbortRegisterPrompt() {
        setShowRegisterPrompt(false);
        navigate("/dashboard");
    }

    const handleConfirmRegisterPrompt = async() => {
        setShowRegisterPrompt(false);
        registerParent(token!, user!.username, user!.userId);
    }

    async function registerParent(token:string, userName:string, userId:string) {
        console.log("Registering as parent with userName:", userName, "userId:", userId);
        try {
            const response = await axios.post(`${apiUrl}/profile/parent`, {}, {
                headers: {
                    Authorization: "Bearer " + token,
                    user_name: userName,
                    user_id: userId,
                },
            });
            console.log("Parent registration response:", response.data);
            // Update the user roles to include parent role 
            if(response.data && response.data.roles){
                // Update the user roles in the context
                console.log("User roles updated:", response.data.roles);
                updateUserRoles(response.data.roles);
            }
            setServerError("");
            setShowPendingWarning(true);

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorKey = error.response.data.error as ChildrenServerErrors;
                let errorMessage: string = translations.children_server_errors[errorKey] ?? translations.children_server_errors.generic_error;
                setServerError(errorMessage);
            }
        }
    }

    if(isLoading){
        return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.loading}</div>
    }

    if(!token){
        return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.redirecting}</div>
    }

    if(typeOfParent() === rejectedParentRole){
        return (
            <div className="flex flex-col items-center min-h-[90vh] w-full my-4 px-4">
                <h1 className="text-3xl font-bold mb-4">{translations.children.children_header}</h1>
                <div className="w-full bg-red-500 text-white mb-4 p-4 rounded text-center">{translations.children.rejected_parent_notice}</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-[90vh] w-full my-4 px-4">
            <div className="flex justify-start w-full">
                <HelpTip content={translations.help.view_children} altText={translations.universal.help_icon}/>
            </div>
            <h1 className="text-3xl font-bold mb-4">{translations.children.children_header}</h1>
            <h2>{translations.children.children_prompt}</h2>
            {showPendingWarning && <div className="w-full bg-[#F4D03F] text-black mb-4 p-2 rounded text-center">{translations.children.pending_parent_limitations}</div>}
            {serverError && <div className="text-red-500 mb-4">{serverError}</div>}
            {childrenList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-center items-center">
                    {childrenList.map((child: any) => (
                        <ChildCard 
                            key={child.childId}
                            firstName={child.firstName}
                            lastName={child.lastName}
                            childId={child.childId}
                            pickupTime={removeSeconds(child.schoolPickupTime)}
                            dropoffTime={removeSeconds(child.schoolDropoffTime)}
                            onEdit={editChild}
                            onDelete={deleteChild}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center mt-4">{translations.children.no_children_message}</div>
            )}
            <Button 
                label={translations.children.add_child_button} 
                variant="primary" 
                onClick={handleAddClick}  
            />
            {showRegisterPrompt && 
                <PendingPromptModal 
                    prompt={translations.children.register_prompt} 
                    abortLabel={translations.children.cancel_register_button} 
                    confirmLabel={translations.children.confirm_register_button} 
                    onAbort={handleAbortRegisterPrompt}
                    onConfirm={handleConfirmRegisterPrompt} 
                />
            }
        </div>
    );
}