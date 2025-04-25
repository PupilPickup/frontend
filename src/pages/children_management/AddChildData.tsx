import React, { use } from "react";
import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChildForm from "../../components/ChildForm";
import { isFieldEmpty, isNameValid, isTimeValid, isPickupAfterDropoff } from "../../utils/childValidation";
import axios from "axios";
import Button from "../../components/common/Button";
import { useUser } from "../../context/UserContext";

// Define the possible error keys
type ChildrenServerErrors = 'empty_fields'| 'firstname_length' | 'lastname_length' | 'school_arrival_time_invalid' | 'school_departure_time_invalid' | 'server_error_get' | 'server_error_post' | 'server_error_put' | 'server_error_delete' | 'generic_error';

const AddChildData: React.FC = () => {

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
    const { user, logout } = useUser();
    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const navigate = useNavigate();

    useEffect(() => {
        if(!token || !user){
            logout(); 
        }
        setIsLoading(false);
    }, [language, token, user]);

    function handleCancel() {
        navigate("/my-children");
    }

    function handleAdd() {
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
            }
            createChildData(token!, childData);
        }
    }


    async function createChildData(token:string, childData: any) {
        try {
            const response = await axios.post(`${apiUrl}/children`, childData, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            const createdData = response.data;
            setFirstName(createdData.firstName);
            setLastName(createdData.lastName);
            setPickupTime(createdData.pickupTime);
            setDropoffTime(createdData.dropoffTime);
            navigate("/my-children")
        }catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorKey = error.response.data.error as ChildrenServerErrors;
                let errorMessage: string = translations.children_server_errors[errorKey] ?? translations.children_server_errors.generic_error;
                setServerError(errorMessage);
            }
        }
    }

    // function to validate the field inputs
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
            isValid = false;
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

    if(isLoading){
        return <div className="flex justify-center items-center min-h-screen">{translations.universal.loading}</div>
    }

    if(!token){
        return <div className="flex justify-center items-center min-h-screen">{translations.universal.redirecting}</div>
    }

    return (
        <div className="border rounded-lg shadow-md p-4 mb-4 bg-white">
            <h2 className="text-lg font-bold mb-2">
                {translations.children.add_child_prompt}
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
                    onClick={handleAdd}
                    className="bg-[#3498DB] hover:bg-[#2C3E50] text-white px-4 py-2 rounded"
                    variant="primary"
                    label={translations.children.add_child_button}
                />
            </div>
        </div>
    );
};

export default AddChildData;