import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isFieldEmpty, isNameValid, isEmailValid, isPhoneValid, isMunicipalityOrDistrictValid, isStreetAddressValid, isWardValid } from "../../utils/profileValidation";
import axios from "axios";

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
    
    const populateUserData = async (token:string, userName:string, userId:string) => {
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
    }, [language, token, userId, username, navigate]);

    // Function for handling the user wanting to edit their profile
    const handleEditProfile = () => {
        setEditingProfileData(profileData);
        setIsViewState(false);
    };

    // Function for handling the user wanting to change their password
    const handleChangePassword = () => {
        navigate("/profile/change-password", { state: { userId } });
    };

    // Function for handling the user wanting to delete their account
    const handleDeleteAccount = () => {
        // TODO Show a confirmation dialog before deleting the account

        // Call the deleteUser function to delete the account
        deleteUser(token!, username!, userId!);
        console.log("Account deleted");

        // TODO deal with issLoggedIn state still being true after deleting user
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
            <h1 className="text-4xl font-bold mb-4">{translations.profile.profile_header}</h1>
            <h2 className="text-xl text-gray-600 mb-8">{translations.profile.profile_prompt}</h2>

            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                {isViewState ? (
                    <div className="mb-4">
                        <strong>{translations.profile.first_name_label}:</strong> {profileData.firstName}
                    </div>
                ) : (
                    <div className="mb-4">
                        <label htmlFor="first-name" className="label">{translations.profile.first_name_label}</label>
                        <input
                            type="text"
                            id="first-name"
                            name="firstName"
                            className="input"
                            value={editingProfileData.firstName}
                            onChange={handleChange}
                        />
                        {firstNameError && (
                            <span className="text-red-500 text-sm mt-1">{firstNameError}</span>
                        )}
                    </div>
                )}
                {isViewState ? (
                    <div className="mb-4">
                        <strong>{translations.profile.last_name_label}:</strong> {profileData.lastName}
                    </div>
                ) : (
                    <div className="mb-4">
                        <label htmlFor="last-name" className="label">{translations.profile.last_name_label}</label>
                        <input
                            type="text"
                            id="last-name"
                            name="lastName"
                            className="input"
                            value={editingProfileData.lastName}
                            onChange={handleChange}
                        />
                        {lastNameError && (
                            <span className="text-red-500 text-sm mt-1">{lastNameError}</span>
                        )}
                    </div>
                )}
                {isViewState ? (
                    <div className="mb-4">
                        <strong>{translations.profile.email_label}:</strong> {profileData.email}
                    </div>
                ) : (
                    <div className="mb-4">
                        <label htmlFor="email" className="label">{translations.profile.email_label}</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            className="input"
                            value={editingProfileData.email}
                            onChange={handleChange}
                        />
                        {emailError && (
                            <span className="text-red-500 text-sm mt-1">{emailError}</span>
                        )}
                    </div>
                )}
                {isViewState ? (
                    <div className="mb-4">
                        <strong>{translations.profile.phone_number_label}:</strong> {profileData.phoneNumber}
                    </div>
                ) : (
                    <div className="mb-4">
                        <label htmlFor="phone-number" className="label">{translations.profile.phone_number_label}</label>
                        <input
                            type="phone"
                            id="phone-number"
                            name="phoneNumber"
                            className="input"
                                            placeholder={translations.sign_up.phone_placeholder}
                            value={editingProfileData.phoneNumber}
                            onChange={handleChange}
                            />
                        {phoneNumberError && (
                        <span className="text-red-500 text-sm mt-1">{phoneNumberError}</span>
                        )}
                    </div>
                )}
                
                {isViewState ? (
                    <div className="mb-4">
                        <strong>{translations.profile.street_address_label}:</strong> {profileData.streetAddress}
                    </div>
                ) : (
                    <div className="mb-4">
                        <label htmlFor="street-address" className="label">{translations.profile.street_address_label}</label>
                        <input
                            type="text"
                            id="street-address"
                            name="streetAddress"
                            className="input"
                            value={editingProfileData.streetAddress}
                            onChange={handleChange}
                        />
                        {streetAddressError && (
                            <span className="text-red-500 text-sm mt-1">{streetAddressError}</span>
                        )}
                    </div>
                )}
                {isViewState ? (
                    <div className="mb-4">
                    <strong>{translations.profile.ward_label}:</strong> {profileData.wardNumber}
                </div>
                ) : (
                    <div className="mb-4">
                        <label htmlFor="street-address" className="label">{translations.profile.ward_label}</label>
                        <input
                            type="number"
                            id="ward"
                            name="wardNumber"
                            className="input"
                            value={editingProfileData.wardNumber? editingProfileData.wardNumber : ""}
                            onChange={handleChange}
                            />
                        {wardNumberError && (
                            <span className="text-red-500 text-sm mt-1">{wardNumberError}</span>
                        )}
                    </div>
                )}
                
                {isViewState ? (
                    <div className="mb-4">
                        <strong>{translations.profile.municipality_label}:</strong> {profileData.municipalityDistrict}
                    </div>
                ) : (
                    <div className="mb-4">
                        <label htmlFor="municipality-district" className="label">{translations.profile.municipality_label}</label>
                        <input
                            type="text"
                            id="municipality-district"
                            name="municipalityDistrict"
                            className="input"
                            value={editingProfileData.municipalityDistrict}
                            onChange={handleChange}
                        />
                        {municipalityDistrictError && (
                            <span className="text-red-500 text-sm mt-1">{municipalityDistrictError}</span>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-8 flex space-x-4">
                {isViewState ? (
                    <div>
                        <button
                            onClick={handleDeleteAccount}
                            className="bg-[#F4D03F] hover:bg-[#FFFFFF] text-black px-4 py-2 rounded border-transparent hover:border-black border-2"
                        >
                            {translations.profile.delete_button}
                        </button>
                        <button
                            onClick={handleChangePassword}
                            className="bg-[#3498DB] hover:bg-[#2C3E50] text-white px-4 py-2 rounded"
                        >
                            {translations.profile.change_password_button}
                        </button>
                        <button
                            onClick={handleEditProfile}
                            className="bg-[#3498DB] hover:bg-[#2C3E50] text-white px-4 py-2 rounded"
                        >
                            {translations.profile.edit_button}
                        </button>
                    </div>
                ):(
                    <div>
                        <button
                            onClick={handleCancelEdit}
                            className="bg-[#3498DB] hover:bg-[#2C3E50] text-white px-4 py-2 rounded"
                        >
                            {translations.profile.cancel_button}
                        </button>
                        <button
                            onClick={handleSaveProfileChanges}
                            className="bg-[#3498DB] hover:bg-[#2C3E50] text-white px-4 py-2 rounded"
                        >
                            {translations.profile.save_button}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}