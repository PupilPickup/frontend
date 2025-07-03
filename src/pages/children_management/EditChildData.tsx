import React from "react";
import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChildForm from "../../components/ChildForm";
import { isFieldEmpty, isNameValid, isTimeValid, isPickupAfterDropoff } from "../../utils/childValidation";
import axios from "axios";
import Button from "../../components/common/Button";
import HelpTip from "../../components/common/HelpTip";
import { useUser } from "../../context/UserContext";

// Define the possible error keys
type ChildrenServerErrors = 'empty_fields'| 'firstname_length' | 'lastname_length' | 'school_arrival_time_invalid' | 'school_departure_time_invalid' | 'server_error_get' | 'server_error_post' | 'server_error_put' | 'server_error_delete' | 'generic_error';

export default function EditChildData(){

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    const [isLoading, setIsLoading] = useState(true);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [pickupTime, setPickupTime] = useState<string>("");
    const [dropoffTime, setDropoffTime] = useState<string>("");
    const [serverError, setServerError] = useState<string>("");
    const [firstNameError, setFirstNameError] = useState<string>("");
    const [lastNameError, setLastNameError] = useState<string>("");
    const [pickupTimeError, setPickupTimeError] = useState<string>("");
    const [dropoffTimeError, setDropoffTimeError] = useState<string>("");

    const token = sessionStorage.getItem("token");
    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const navigate = useNavigate();
    const { user, isLoggedIn, logout } = useUser()

    // Get the character id
    const { id: childId } = useParams();

    useEffect(() => {
        async function fetchChildData(token:string, userName:string, userId:string, childId:string) {
            try {
                const response = await axios.get(`${apiUrl}/children/${childId}`, {
                    headers: {
                        Authorization: "Bearer " + token,
                        user_name: userName,
                        user_id: userId,
                    },
                });
                const childData = response.data;
                setFirstName(childData.first_name);
                setLastName(childData.last_name);
                setPickupTime(removeSeconds(childData.school_pickup_time));
                setDropoffTime(removeSeconds(childData.school_dropoff_time));
            }catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    const errorKey = error.response.data.error as ChildrenServerErrors;
                    let errorMessage: string = translations.children_server_errors[errorKey] ?? translations.children_server_errors.generic_error;
                    setServerError(errorMessage);
                }
            }
        }
        if(!token || user === null || user === undefined || !isLoggedIn){
            sessionStorage.removeItem("token");
            logout();
            navigate("/");
        }else if(!childId){
            navigate("/my-children");
        }else{
            // Fetch child data here and set the state variables
            fetchChildData(token, user.username, user.userId, childId);
        }
        setIsLoading(false);
        // This effect runs when the component mounts or when the language changes
        // You can add any side effects here if needed
    }, [language, childId, isLoggedIn, navigate, token, user, isLoggedIn, logout, apiUrl, translations.children_server_errors]);

    async function updateChildData(token:string, childId:string, childData: any) {
        try {
            const response = await axios.put(`${apiUrl}/children/${childId}`, childData, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            const editedData = response.data;
            setFirstName(editedData.firstName);
            setLastName(editedData.lastName);
            setPickupTime(removeSeconds(childData.schoolPickupTime));
            setDropoffTime(removeSeconds(childData.schoolDropoffTime));
            setServerError("");
            navigate("/my-children");
        }catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorKey = error.response.data.error as ChildrenServerErrors;
                let errorMessage: string = translations.children_server_errors[errorKey] ?? translations.children_server_errors.generic_error;
                setServerError(errorMessage);
            }
        }
    }

    function handleCancel() {
        navigate("/my-children");
    }

    function handleSave() {
        // TODO Add child logic here
        if(!validateFields()){
            return;
        }else{
            const childData = {
                userName: user!.username,
                userId: user!.userId,
                firstName: firstName,
                lastName: lastName,
                schoolPickupTime: pickupTime,
                schoolDropoffTime: dropoffTime
            };

            updateChildData(token!, childId!, childData);
        }
    }

    function validateFields() {
        let isValid = true;
        // First name validation
        if(isFieldEmpty(firstName)){
            setFirstNameError(translations.children.require_first_name_error);
            isValid = false;
        }else if(!isNameValid(firstName)){
            setFirstNameError(translations.children.invalid_first_name_error);
            isValid = false;
        }else{
            setFirstNameError("");
        }
        // Last name validation
        if(isFieldEmpty(lastName)){
            setLastNameError(translations.children.require_last_name_error);
            isValid = false;
        }else if(!isNameValid(lastName)){
            setLastNameError(translations.children.invalid_last_name_error);
            isValid = true;
        }else{
            setLastNameError("");
        }
        // Pickup time validation
        if(isFieldEmpty(pickupTime)){
            setPickupTimeError(translations.children.require_end_time_error);
            isValid = false;
        } else if(!isTimeValid(pickupTime)){
            setPickupTimeError(translations.children.invalid_end_time_error);
            isValid = false;
        }else{
            setPickupTimeError("");
        }
        // Dropoff time validation
        if(isFieldEmpty(dropoffTime)){
            setDropoffTimeError(translations.children.require_start_time_error);
            isValid = false;
        }else if(!isTimeValid(dropoffTime)){
            setDropoffTimeError(translations.children.invalid_start_time_error);
            isValid = false;
        }else{
            setDropoffTimeError("");
        }

        // Check if pickup time is before dropoff time
        if(isValid && !isPickupAfterDropoff(pickupTime, dropoffTime)){
            setDropoffTimeError(translations.children.invalid_time_order);
            isValid = false;
        }

        return isValid;
    }

    function removeSeconds(timeString: string){
        const sections = timeString.split(":")
        return sections[0] + ":" + sections[1];
    }


    if(isLoading){
        return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.loading}</div>
    }

    if(!token){
        return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.redirecting}</div>
    }

    return (
        <div className="px-4 pb-4 flex flex-col w-full items-center">
            <div className="flex justify-start w-full mt-2 p-1 pl-0">
                <HelpTip content={translations.help.edit_child} altText={translations.universal.help_icon}/>
            </div>
            <div className="flex flex-col border rounded-lg shadow-md p-4 my-4 bg-white w-full sm:max-w-[52rem]">
                <h2 className="text-lg font-bold mb-2 sm:text-center">
                    {translations.children.edit_child_prompt}
                </h2>
                {!!serverError && 
                <p className="text-red-500 text-sm">{serverError}</p>
                }
                <ChildForm
                    firstName={firstName}
                    lastName={lastName}
                    pickupTime={pickupTime}
                    dropoffTime={dropoffTime}
                    setFirstName={setFirstName}
                    setLastName={setLastName}
                    setPickupTime={setPickupTime}
                    setDropoffTime={setDropoffTime}            
                    firstNameError={firstNameError}
                    lastNameError={lastNameError}
                    pickupTimeError={pickupTimeError}
                    dropoffTimeError={dropoffTimeError}
                />
                <div className="mt-4 flex flex-row justify-between space-x-4">
                    <Button
                        onClick={handleCancel}
                        variant="secondary"
                        label={translations.children.cancel_button}
                    />
                    <Button
                        onClick={handleSave}
                        variant="primary"
                        label={translations.children.save_button}
                    />  
                </div>
            </div>
        </div>
    );
};