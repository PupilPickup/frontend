import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isFieldEmpty, isNameValid, isEmailValid, isPhoneValid, isMunicipalityOrDistrictValid, isStreetAddressValid, isWardValid } from "../../utils/profileValidation";
import axios from "axios";
import Button from "../../components/common/Button";
import CardLabel from "../../components/common/CardLabel";
import ProfileInput from "../../components/common/ProfileInput";
import DeleteWarningModal from "../../components/common/DeleteWarningModal";
import HelpTip from "../../components/common/HelpTip";

// Define the possible error keys
type ProfileServerErrors = 'empty_fields' | 'username_not_existent' | 'invalid_credentials' | 'server_error_get' |'server_error_put' |'server_error_delete' | 'generic_error' | 'firstname_length' | 'lastname_length' | 'email_length' | 'phone_length' | 'street_address_length' | 'ward_number_invalid' | 'municipality_district_length' | 'username_unknown' | 'email_exists';

type UserProfileProps = {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UserProfile ( { isLoggedIn, setIsLoggedIn }: UserProfileProps) {
    const [isLoading, setIsLoading] = useState(true);
    const[isViewState, setIsViewState] = useState(true);
    const [profileData, setProfileData] = useState({
        userName: "",
        userId: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        streetAddress: "",
        wardNumber: "",
        municipalityDistrict: "",
    });
    const [editingProfileData, setEditingProfileData] = useState({
        userName: "",
        userId: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        streetAddress: "",
        wardNumber: "",
        municipalityDistrict: "",
    });
    const [serverError, setServerError] = useState<string>("");
    const [firstNameError, setFirstNameError] = useState<string>("");
    const [lastNameError, setLastNameError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [phoneNumberError, setPhoneNumberError] = useState<string>("");
    const [streetAddressError, setStreetAddressError] = useState<string>("");
    const [wardNumberError, setWardNumberError] = useState<string>("");
    const [municipalityDistrictError, setMunicipalityDistrictError] = useState<string>("");
    const [showDeleteWarning, setShowDeleteWarning] = useState<boolean>(false);


    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const username = sessionStorage.getItem("user_name");
	const userId = sessionStorage.getItem("user_id");
    
    /**
     * updateUser is an asynchronous function that takes a validated User data and PUTs it to the server to update the user's profile in the database.
     * 
     * @param {Object}      characterObject 
     * @param {string}      token 
     * 
     */
    const updateUser = async(userProfile:any, token:string) =>{
        try{
            const response = await axios.put(`${apiUrl}/profile`, userProfile, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            if(!!response.data){
                // Populate the user data with the updated data
                setProfileData({
                    userName: response.data.userName,
                    userId: response.data.userId,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    phoneNumber: response.data.contactNumber,
                    streetAddress: response.data.streetAddress,
                    wardNumber: response.data.wardNumber,
                    municipalityDistrict: response.data.municipalityDistrict,
                });
                // TODO success message?
                // Return to view state
                setIsViewState(true);
            }

        }catch(error){
            console.error(error);
            if (axios.isAxiosError(error) && error.response) {
                const errorKey = error.response.data.error as ProfileServerErrors;
                let errorMessage: string = translations.profile_server_errors[errorKey] ?? translations.profile_server_errors.generic_error;
                setServerError(errorMessage);
            }
        }
    };
    
    function editUserProfile(profileData:any, token:string){
        // Validate profileData before sending to the server
        let hasErrors = false;
        // First Name
        if(isFieldEmpty(profileData.firstName)) {
            setFirstNameError(translations.profile.require_first_name_error);
            hasErrors = true;
        }else if(!isNameValid(profileData.firstName)) {
            setFirstNameError(translations.profile.invalid_first_name_error);
            hasErrors = true;
        }else{
            setFirstNameError("");
        }
        // Last Name
        if(isFieldEmpty(profileData.lastName)) {
            setLastNameError(translations.profile.require_last_name_error);
            hasErrors = true;
        }else if(!isNameValid(profileData.lastName)) {
            setLastNameError(translations.profile.invalid_last_name_error);
            hasErrors = true;
        }else{
            setLastNameError("");
        }
        // Email
        if(isFieldEmpty(profileData.email)) {
            setEmailError(translations.profile.require_email_error);
            hasErrors = true;
        }else if(!isEmailValid(profileData.email)) {
            setEmailError(translations.profile.invalid_email_error);
            hasErrors = true;
        }else{
            setEmailError("");
        }
        // Phone Number
        if(isFieldEmpty(profileData.phoneNumber)) {
            setPhoneNumberError(translations.profile.require_phone_number_error);
            hasErrors = true;
        }else if(!isPhoneValid(profileData.phoneNumber)) {
            setPhoneNumberError(translations.profile.invalid_phone_number_error);
            hasErrors = true;
        }else{
            setPhoneNumberError("");
        }
        // Street Address
        if(isFieldEmpty(profileData.streetAddress)) {
            setStreetAddressError(translations.profile.require_street_address_error);
            hasErrors = true;
        }else if(!isStreetAddressValid(profileData.streetAddress)) {
            setStreetAddressError(translations.profile.invalid_street_address_error);
            hasErrors = true;
        }else{
            setStreetAddressError("");
        }
        // Ward Number
        if(isFieldEmpty(profileData.wardNumber)) {
            setWardNumberError(translations.profile.require_ward_error);
            hasErrors = true;
        }else if(!isWardValid(profileData.wardNumber)) {
            setWardNumberError(translations.profile.invalid_ward_error);
            hasErrors = true;
        }else{
            setWardNumberError("");
        }
        // Municipality or District
        if(isFieldEmpty(profileData.municipalityDistrict)) {
            setMunicipalityDistrictError(translations.profile.require_municipality_error);
            hasErrors = true;
        }else if(!isMunicipalityOrDistrictValid(profileData.municipalityDistrict)) {
            setMunicipalityDistrictError(translations.profile.invalid_municipality_error);
            hasErrors = true;
        }else{
            setMunicipalityDistrictError("");
        }

        // Check if there are any errors
        if(hasErrors) {
            return;
        }else{
            // Post updated user data to the server
            updateUser(profileData, token!);
        }
    }

    // Function to delete a user's account
    const deleteUser = async (token:string, userName:string, userId:string) => {
        try {
            await axios.delete(`${apiUrl}/profile`, {
                headers: {
                    Authorization: "Bearer " + token,
                    user_name: userName,
                    user_id: userId,
                },
            });
            setServerError("");
            // TODO show a success message
            // Logout the user and redirect to the login page
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user_name");
            sessionStorage.removeItem("user_id");
            setIsLoggedIn(false);
            navigate("/");

        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error) && error.response) {
                const errorKey = error.response.data.error as ProfileServerErrors;
                let errorMessage: string = translations.profile_server_errors[errorKey] ?? translations.profile_server_errors.generic_error;
                setServerError(errorMessage);
            }
        }
    } 

    useEffect(() => {
        if(!token || !userId || !username || !isLoggedIn){
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user_name");
            sessionStorage.removeItem("user_id");
            setIsLoggedIn(false);
            navigate("/"); 
        }

        async function populateUserData(token:string, userName:string, userId:string) {
            try {
                const response = await axios.get(`${apiUrl}/profile`, {
                    headers: {
                        Authorization: "Bearer " + token,
                        user_name: userName,
                        user_id: userId,
                    },
                });
                const userDetails = response.data;
                setProfileData({
                    userName: userDetails.userName,
                    userId: userDetails.userId,
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    email: userDetails.email,
                    phoneNumber: userDetails.contactNumber,
                    streetAddress: userDetails.streetAddress,
                    wardNumber: userDetails.wardNumber,
                    municipalityDistrict: userDetails.municipalityDistrict,
                });
                setServerError("");
                setIsLoading(false);

            } catch (error) {
                console.error(error);
                if (axios.isAxiosError(error) && error.response) {
                    const errorKey = error.response.data.error as ProfileServerErrors;
                    let errorMessage: string = translations.profile_server_errors[errorKey] ?? translations.profile_server_errors.generic_error;
                    setServerError(errorMessage);
                }
                setIsLoading(false);
            }
        }

        // Fetch user profile data from the API using the token
        try {
            if(!!token && !!userId && !!username){
                populateUserData(token!, username!, userId!);
                resetErrors();
            }
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    }, [language, token, userId, username, navigate, isLoggedIn, setIsLoggedIn, apiUrl, translations.profile_server_errors]);

    // Function for handling the user wanting to edit their profile
    const handleEditProfile = () => {
        setEditingProfileData(profileData);
        setIsViewState(false);
    };

    // Function for handling the user wanting to change their password
    const handleChangePassword = () => {
        navigate("/profile/change-password", { state: { userId } });
    };

    // Function to display a confirmation dialog before deleting the account
    const confirmDelete = () => {
        setShowDeleteWarning(true);
    }

    // Function to handle the user cancelling their decision to delete their account
    const cancelDelete = () => {
        setShowDeleteWarning(false);
    }

    // Function for handling the user wanting to delete their account
    const handleDeleteAccount = async () => {
        // Call the deleteUser function to delete the account
        setShowDeleteWarning(false);
        deleteUser(token!, username!, userId!);
        console.log("Account deleted");
    };

    // Function for handling the user saving their profile changes
    const handleSaveProfileChanges = () => {
        editUserProfile(editingProfileData, token!);
    };

    // Function for handling the user canceling their profile edit
    const handleCancelEdit = () => {
        setEditingProfileData(profileData);
        setIsViewState(true);
    }

    // Update values as user edits their data
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditingProfileData({ ...editingProfileData, [e.target.name]: e.target.value });
    };

    // Function to reset all error messages
    function resetErrors(){
        setFirstNameError("");
        setLastNameError("");
        setEmailError("");
        setPhoneNumberError("");
        setStreetAddressError("");
        setWardNumberError("");
        setMunicipalityDistrictError("");
        setServerError("");
    }

    if(isLoading){
        return <div className="flex justify-center items-center min-h-screen">{translations.universal.loading}</div>
    }

    if(!token){
        return <div className="flex justify-center items-center min-h-screen">{translations.universal.redirecting}</div>
    }

    return (
        <div className="min-h-screen flex flex-col items-center p-6">
            <div className="flex justify-start w-full">
                <HelpTip content={translations.help.profile} altText={translations.universal.help_icon}/>
            </div>
            <h1 className="text-4xl font-bold mb-4">{translations.profile.profile_header}</h1>
            <h2 className="text-xl text-gray-600 mb-8">{translations.profile.profile_prompt}</h2>
            {serverError && (
                <div className="text-red-500 text-sm mb-4">{serverError}</div>
            )}
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                {isViewState ? (
                    <div className="mb-4">
                        <CardLabel
                            label={translations.profile.first_name_label}
                            data={profileData.firstName}
                        />
                    </div>
                ) : (
                    <ProfileInput
                        label={translations.profile.first_name_label}
                        elementId="firstName"
                        value={editingProfileData.firstName}
                        changeHandler={handleChange}
                        error={firstNameError}
                    />
                )}
                {isViewState ? (
                    <div className="mb-4">
                        <CardLabel
                            label={translations.profile.last_name_label}
                            data={profileData.lastName}
                        />
                    </div>
                ) : (
                    <ProfileInput
                        label={translations.profile.last_name_label}
                        elementId="lastName"
                        value={editingProfileData.lastName}
                        changeHandler={handleChange}
                        error={lastNameError}
                    />
                )}
                {isViewState ? (
                    <div className="mb-4">
                        <CardLabel
                            label={translations.profile.email_label}
                            data={profileData.email}
                        />
                    </div>
                ) : (
                    <ProfileInput
                        label={translations.profile.email_label}
                        elementId="email"
                        value={editingProfileData.email}
                        changeHandler={handleChange}
                        error={emailError}
                    />
                )}
                {isViewState ? (
                    <div className="mb-4">
                        <CardLabel
                            label={translations.profile.phone_number_label}
                            data={profileData.phoneNumber}
                        />
                    </div>
                ) : (
                    <ProfileInput
                        label={translations.profile.phone_number_label}
                        elementId="phoneNumber"
                        value={editingProfileData.phoneNumber}
                        changeHandler={handleChange}
                        error={phoneNumberError}
                        placeholder={translations.sign_up.phone_placeholder}
                        isPhone={true}
                    />
                )}
                
                {isViewState ? (
                    <div className="mb-4">
                        <CardLabel
                            label={translations.profile.street_address_label}
                            data={profileData.streetAddress}
                        />
                    </div>
                ) : (
                    <ProfileInput
                        label={translations.profile.street_address_label}
                        elementId="streetAddress"
                        value={editingProfileData.streetAddress}
                        changeHandler={handleChange}
                        error={streetAddressError}
                    />
                )}
                {isViewState ? (
                    <div className="mb-4">
                        <CardLabel
                            label={translations.profile.ward_label}
                            data={profileData.wardNumber}
                        />
                    </div>
                ) : (
                    <ProfileInput
                        label={translations.profile.ward_label}
                        elementId="wardNumber"
                        value={editingProfileData.wardNumber? editingProfileData.wardNumber : ""}
                        changeHandler={handleChange}
                        error={wardNumberError}
                        isNumber={true}
                    />
                )}
                
                {isViewState ? (
                    <div className="mb-4">
                        <CardLabel
                            label={translations.profile.municipality_label}
                            data={profileData.municipalityDistrict}
                        />
                    </div>
                ) : (
                    <ProfileInput
                        label={translations.profile.municipality_label}
                        elementId="municipalityDistrict"
                        value={editingProfileData.municipalityDistrict}
                        changeHandler={handleChange}
                        error={municipalityDistrictError}
                    />
                )}
            </div>

            <div className="mt-8 w-full max-w-md flex flex-row justify-center">
                {isViewState ? (
                    <div className="flex flex-row w-full max-w-md justify-between space-x-4">
                        <Button
                            onClick={confirmDelete}
                            variant="secondary"
                            label={translations.profile.delete_button}
                        />
                        <Button
                            onClick={handleChangePassword}
                            variant="primary"
                            label={translations.profile.change_password_button}
                        />
                        <Button
                            onClick={handleEditProfile}
                            variant="primary"
                            label={translations.profile.edit_button}
                        />
                    </div>
                ):(
                    <div className="flex flex-row w-full max-w-md justify-between space-x-6">
                        <Button
                            onClick={handleCancelEdit}
                            variant="secondary"
                            label={translations.profile.cancel_button}
                        />
                        <Button
                            onClick={handleSaveProfileChanges}
                            variant="primary"
                            label={translations.profile.save_button}
                        />
                    </div>
                )}
            </div>
            {showDeleteWarning &&  <DeleteWarningModal prompt={translations.profile.delete_confirmation_message} abortLabel={translations.profile.cancel_button} confirmLabel={translations.profile.delete_button} onAbort={cancelDelete} onConfirm={handleDeleteAccount} />}
        </div>
    );
}