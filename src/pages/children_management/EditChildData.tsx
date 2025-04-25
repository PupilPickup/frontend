import React, { use } from "react";
import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChildForm from "../../components/ChildForm";
import { isFieldEmpty, isNameValid, isTimeValid, isPickupAfterDropoff } from "../../utils/childValidation";
import axios from "axios";
import Button from "../../components/common/Button";

type EditChildDataProps = {
    isLoggedIn: boolean;
};

// Define the possible error keys
type ChildrenServerErrors = 'empty_fields'| 'firstname_length' | 'lastname_length' | 'school_arrival_time_invalid' | 'school_departure_time_invalid' | 'server_error_get' | 'server_error_post' | 'server_error_put' | 'server_error_delete' | 'generic_error';


const EditChildData: React.FC<EditChildDataProps> = ({
    isLoggedIn
}) => {

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
    const username = sessionStorage.getItem("user_name");
    const userId = sessionStorage.getItem("user_id");
    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const navigate = useNavigate();

    // Get the character id
    const { id: childId } = useParams();

    useEffect(() => {
        if(!token || !userId || !username || !isLoggedIn){
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user_name");
            sessionStorage.removeItem("user_id");
            navigate("/"); 
        }else if(!childId){
            navigate("/my-children");
        }else{
            // Fetch child data here and set the state variables
            fetchChildData(token, username, userId, childId);
        }
        setIsLoading(false);
        // This effect runs when the component mounts or when the language changes
        // You can add any side effects here if needed
    }, [language]);

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
                userName: username,
                userId: userId,
                firstName: firstName,
                lastName: lastName,
                schoolPickupTime: pickupTime,
                schoolDropoffTime: dropoffTime
            }

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
        // const size: number = timeString.length;
        // return timeString.substring(0, size-3);
    }


    if(isLoading){
        return <div className="flex justify-center items-center min-h-screen">{translations.universal.loading}</div>
    }

    if(!token){
        return <div className="flex justify-center items-center min-h-screen">{translations.universal.redirecting}</div>
    }

    return (
        <div className="border rounded-lg shadow-md p-4 mb-4 bg-white">
            <h2 className="text-lg font-bold mb-2">
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
            <div className="mt-4 flex space-x-4">
                <Button
                    onClick={handleCancel}
                    className="bg-[#F4D03F] hover:bg-[#FFFFFF] text-black px-4 py-2 rounded border-transparent hover:border-black border-2"
                    variant="secondary"
                    label={translations.children.cancel_button}
                />
                <Button
                    onClick={handleSave}
                    className="bg-[#3498DB] hover:bg-[#2C3E50] text-white px-4 py-2 rounded"
                    variant="primary"
                    label={translations.children.save_button}
                />  
            </div>
        </div>
    );
};

export default EditChildData;