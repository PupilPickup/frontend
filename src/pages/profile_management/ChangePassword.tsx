import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import { validatePassword } from "../../utils/profileValidation"; 
import axios from "axios";
import Button from "../../components/common/Button";
import FormInput from "../../components/common/FormInput";

// Define the possible error keys
type PasswordServerErrors = 'empty_fields' | 'invalid_password' | 'server_error_put' | 'generic_error';

type ChangePasswordProps = {
    isLoggedIn: boolean;
};

export default function ChangePassword ( { isLoggedIn }: ChangePasswordProps) {
    
    const [currentPassword, setcurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const username = sessionStorage.getItem("user_name");
	const userId = sessionStorage.getItem("user_id");
    

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    useEffect(() => {
        if(!token || !userId || !username || !isLoggedIn){
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user_name");
            sessionStorage.removeItem("user_id");
            navigate("/"); 
        }
        setErrorMessage("");
    }, [language, token, userId, username, navigate]);


    const handleSave = async () => {
        if(!currentPassword) {
            setErrorMessage(translations.profile.require_current_password_error);
            return;
        }else if(!newPassword) {
            setErrorMessage(translations.profile.require_new_password_error);
            return;
        }else if(!confirmPassword) {
            setErrorMessage(translations.profile.require_confirm_new_password_error);
            return;
        }else if(newPassword !== confirmPassword) {
            setErrorMessage(translations.profile.password_mismatch_error);
            return;
        }else if(!validatePassword(newPassword)) {
            setErrorMessage(translations.profile.invalid_password_error);
            return;
        }

        try {
            const requestBody = {
                username: username,
                oldPassword: currentPassword,
                newPassword: newPassword
            };
            await axios.put(`${apiUrl}/users/password`, requestBody, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });

            // Clear any previous error message
            setErrorMessage(""); 
            // TODO Give success message to user
            // alert(`${translations.profile.password_change_success_message}`);
            // Return to the profile page
            navigate("/profile");

        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error) && error.response) {
                const errorKey = error.response.data.error as PasswordServerErrors;
                let errorMessage: string = translations.profile_server_errors[errorKey] || translations.profile_server_errors.generic_error;
            setErrorMessage(errorMessage);
            }
        }
    };

    const handleCancel = () => {
        navigate("/profile"); // Redirect to the profile page
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <h1 className="text-2xl font-bold mb-6">{translations.profile.change_password_button}</h1>
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
                )}
                <FormInput 
                    label={translations.profile.current_password_label}
                    elementId="currentPassword"
                    changeHandler={setcurrentPassword}
                    value={currentPassword}
                    error="" 
                    isPassword={true}
                />
                {/* <div className="mb-4">
                    <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                        {translations.profile.current_password_label}
                    </label>
                    <input
                        type="password"
                        id="currentPassword"
                        className="w-full border rounded px-3 py-2"
                        value={currentPassword}
                        onChange={(e) => setcurrentPassword(e.target.value)}
                    />
                </div> */}
                <FormInput 
                    label={translations.profile.new_password_label}
                    elementId="newPassword"
                    changeHandler={setNewPassword}
                    value={newPassword}
                    error="" 
                    isPassword={true}
                />
                {/* <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                        {translations.profile.new_password_label}
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        className="w-full border rounded px-3 py-2"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div> */}
                <FormInput 
                    label={translations.profile.confirm_new_password_label}
                    elementId="confirmPassword"
                    changeHandler={setConfirmPassword}
                    value={confirmPassword}
                    error="" 
                    isPassword={true}
                />
                {/* <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                        {translations.profile.confirm_new_password_label}
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="w-full border rounded px-3 py-2"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div> */}
                <div className="mt-4 flex flex-row justify-between space-x-4">
                    <Button
                        onClick={handleCancel}
                        variant="secondary"
                        label={translations.profile.cancel_button}
                    />
                    <Button
                        onClick={handleSave}
                        variant="primary"
                        label={translations.profile.save_button}
                    />
                </div>
            </div>
        </div>
    );
};