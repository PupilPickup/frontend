import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isFieldEmpty, isWardValid, isPhoneValid, isNameValid, isMunicipalityOrDistrictValid, isStreetAddressValid, isEndAfterStart, isTimeValid} from "../../utils/schoolValidation";
import axios from "axios";
import Button from "../../components/common/Button";
import CardLabel from "../../components/common/CardLabel";
import ProfileInput from "../../components/common/ProfileInput";
import HelpTip from "../../components/common/HelpTip";

// Define the possible error keys
type SchoolServerErrors = 'server_error_get' |'server_error_put' | 'generic_error' | "username_unknown" | "school_unknown" | "admin_unknown" | "user_not_admin";

type SchoolManagementProps = {
    isLoggedIn: boolean;
    isAdmin: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setIsAdmin: (isAdmin: boolean) => void;
};

export default function SchoolManagement ( { isLoggedIn, isAdmin, setIsLoggedIn, setIsAdmin }: SchoolManagementProps) {
    const [isLoading, setIsLoading] = useState(true);
    const[isViewState, setIsViewState] = useState(true);
    const [schoolData, setSchoolData] = useState({
        schoolName: "",
    	contactNumber: "",
    	streetAddress: "",
    	wardNumber: "",
    	municipalityDistrict: "",
    	carpoolDropoffStartTime: "",
    	carpoolPickupStartTime: "",
    	carpoolDropoffEndTime: "",
    	carpoolPickupEndTime: "",
    	carpoolDropoffLocation: "",
    	carpoolPickupLocation: ""
    });
    const [editingSchoolData, setEditingSchoolData] = useState({
        schoolName: "",
    	contactNumber: "",
    	streetAddress: "",
    	wardNumber: "",
    	municipalityDistrict: "",
    	carpoolDropoffStartTime: "",
    	carpoolPickupStartTime: "",
    	carpoolDropoffEndTime: "",
    	carpoolPickupEndTime: "",
    	carpoolDropoffLocation: "",
    	carpoolPickupLocation: ""
    });
    const [serverError, setServerError] = useState<string>("");
    const [schoolNameError, setSchoolNameError] = useState<string>("");
    const [contactNumberError, setContactNumberError] = useState<string>("");
    const [streetAddressError, setStreetAddressError] = useState<string>("");
    const [wardNumberError, setWardNumberError] = useState<string>("");
    const [municipalityDistrictError, setMunicipalityDistrictError] = useState<string>("");
    const [carpoolDropoffStartTimeError, setCarpoolDropoffStartTimeError] = useState<string>("");
    const [carpoolPickupStartTimeError, setCarpoolPickupStartTimeError] = useState<string>("");
    const [carpoolDropoffEndTimeError, setCarpoolDropoffEndTimeError] = useState<string>("");
    const [carpoolPickupEndTimeError, setCarpoolPickupEndTimeError] = useState<string>("");
    const [carpoolDropoffLocationError, setCarpoolDropoffLocationError] = useState<string>("");
    const [carpoolPickupLocationError, setCarpoolPickupLocationError] = useState<string>("");

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const username = sessionStorage.getItem("user_name");
	const userId = sessionStorage.getItem("user_id");
    
    /**
     * updateSchool is an asynchronous function that takes a validated School data and PUTs it to the server to update the school's profile in the database.
     * 
     * @param {Object}      schoolProfile 
     * @param {string}      token 
     * 
     */
    const updateSchool = async(schoolProfile:any, token:string, username: string, userId: string) =>{
        try{
            const response = await axios.put(`${apiUrl}/school/1`, schoolProfile, {
                headers: {
                    Authorization: "Bearer " + token,
                    user_name: username,
                    user_id: userId,
                },
            });
            if(!!response.data){
                // Populate the user data with the updated data
                setSchoolData({
                    schoolName: response.data.school_name,
                    contactNumber: response.data.contact_number,
                    streetAddress: response.data.street_address,
                    wardNumber: response.data.ward_number,
                    municipalityDistrict: response.data.municipality_district,
                    carpoolDropoffStartTime: response.data.carpool_dropoff_start_time,
                    carpoolPickupStartTime: response.data.carpool_pickup_start_time,
                    carpoolDropoffEndTime: response.data.carpool_dropoff_end_time,
                    carpoolPickupEndTime: response.data.carpool_pickup_end_time,
                    carpoolDropoffLocation: response.data.carpool_dropoff_location,
                    carpoolPickupLocation: response.data.carpool_pickup_location
                });
                // TODO success message?
                // Return to view state
                setIsViewState(true);
            }

        }catch(error){
            console.error(error);
            if (axios.isAxiosError(error) && error.response) {
                const errorKey = error.response.data.error as SchoolServerErrors;
                // TODO language support for error messages
                let errorMessage: string = translations.school_server_errors[errorKey] ?? translations.school_server_errors.generic_error;
                setServerError(errorMessage);
            }
        }
    };
    
    function editSchoolProfile(profileData:any, token:string){
        // Validate profileData before sending to the server
        let hasErrors = false;
        // School Name
        if(isFieldEmpty(profileData.schoolName)) {
            setSchoolNameError(translations.school.require_school_name_error);
            hasErrors = true;
        }else if(!isNameValid(profileData.schoolName)) {
            setSchoolNameError(translations.school.invalid_school_name_error);
            hasErrors = true;
        }else{
            setSchoolNameError("");
        }
        // Phone Number
        if(isFieldEmpty(profileData.contactNumber)) {
            setContactNumberError(translations.school.require_contact_number_error);
            hasErrors = true;
        }else if(!isPhoneValid(profileData.contactNumber)) {
            setContactNumberError(translations.school.invalid_contact_number_error);
            hasErrors = true;
        }else{
            setContactNumberError("");
        }
        // Street Address
        if(isFieldEmpty(profileData.streetAddress)) {
            setStreetAddressError(translations.school.require_street_address_error);
            hasErrors = true;
        }else if(!isStreetAddressValid(profileData.streetAddress)) {
            setStreetAddressError(translations.school.invalid_street_address_error);
            hasErrors = true;
        }else{
            setStreetAddressError("");
        }
        // Ward Number
        if(isFieldEmpty(profileData.wardNumber)) {
            setWardNumberError(translations.school.require_ward_error);
            hasErrors = true;
        }else if(!isWardValid(profileData.wardNumber)) {
            setWardNumberError(translations.school.invalid_ward_error);
            hasErrors = true;
        }else{
            setWardNumberError("");
        }
        // Municipality or District
        if(isFieldEmpty(profileData.municipalityDistrict)) {
            setMunicipalityDistrictError(translations.school.require_municipality_error);
            hasErrors = true;
        }else if(!isMunicipalityOrDistrictValid(profileData.municipalityDistrict)) {
            setMunicipalityDistrictError(translations.school.invalid_municipality_error);
            hasErrors = true;
        }else{
            setMunicipalityDistrictError("");
        }

        // Carpool Dropoff Start Time
        if(isFieldEmpty(profileData.carpoolDropoffStartTime)) {
            setCarpoolDropoffStartTimeError(translations.school.require_dropoff_start_time_error);
            hasErrors = true;
        } else if(!isTimeValid(profileData.carpoolDropoffStartTime)) {
            setCarpoolDropoffStartTimeError(translations.school.invalid_time_error);
            hasErrors = true;
        } else {    
            setCarpoolDropoffStartTimeError("");
        }

        // Carpool Pickup Start Time
        if(isFieldEmpty(profileData.carpoolPickupStartTime)) {
            setCarpoolPickupStartTimeError(translations.school.require_pickup_start_time_error);
            hasErrors = true;
        } else if(!isTimeValid(profileData.carpoolPickupStartTime)) {
            setCarpoolPickupStartTimeError(translations.school.invalid_time_error);
            hasErrors = true;
        } else {    
            setCarpoolPickupStartTimeError("");
        }

        // Carpool Dropoff End Time
        if(isFieldEmpty(profileData.carpoolDropoffEndTime)) {
            setCarpoolDropoffEndTimeError(translations.school.require_dropoff_end_time_error);
            hasErrors = true;
        } else if(!isTimeValid(profileData.carpoolDropoffEndTime)) {
            setCarpoolDropoffEndTimeError(translations.school.invalid_time_error);
            hasErrors = true;
        } else {    
            setCarpoolDropoffStartTimeError("");
        }

        // Carpool Pickup Start Time
        if(isFieldEmpty(profileData.carpoolPickupEndTime)) {
            setCarpoolPickupEndTimeError(translations.school.require_pickup_end_time_error);
            hasErrors = true;
        } else if(!isTimeValid(profileData.carpoolPickupEndTime)) {
            setCarpoolPickupEndTimeError(translations.school.invalid_time_error);
            hasErrors = true;
        } else {    
            setCarpoolPickupEndTimeError("");
        }

        // Carpool Dropoff Location
        if(isFieldEmpty(profileData.carpoolDropoffLocation)) {
            setCarpoolDropoffLocationError(translations.school.require_dropoff_location_error);
            hasErrors = true;
        } else {
            setCarpoolDropoffLocationError("");
        }
        // Carpool Pickup Location
        if(isFieldEmpty(profileData.carpoolPickupLocation)) {
            setCarpoolPickupLocationError(translations.school.require_pickup_location_error);
            hasErrors = true;
        } else {
            setCarpoolPickupLocationError("");
        }

        // Check if there are any errors
        if(hasErrors) {
            return;
        }else{
            // Check that the dropoff start time is before the dropoff end time
            if(!isEndAfterStart(profileData.carpoolDropoffStartTime, profileData.carpoolDropoffEndTime)){
                setCarpoolDropoffEndTimeError(translations.school.end_after_start_error);
                return;
            }

            // Check that the pickup start time is before the pickup end time
            if(!isEndAfterStart(profileData.carpoolPickupStartTime, profileData.carpoolPickupEndTime)){
                setCarpoolPickupEndTimeError(translations.school.end_after_start_error);
                return;
            }

            // Post updated user data to the server
            updateSchool(profileData, token!, username!, userId!);
        }
    }

    useEffect(() => {
        if(!token || !userId || !username || !isLoggedIn){
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user_name");
            sessionStorage.removeItem("user_id");
            setIsLoggedIn(false);
            setIsAdmin(false);
            navigate("/"); 
        }

        // Check if the user is an admin and if not redirect them to the dashboard
        if(!isAdmin){
            navigate("/dashboard");
            return;
        }

        async function populateSchoolData(token:string, userName:string, userId:string) {
            try {
                const response = await axios.get(`${apiUrl}/school/1`, {
                    headers: {
                        Authorization: "Bearer " + token,
                        user_name: userName,
                        user_id: userId,
                    },
                });
                const schoolDetails = response.data;
                setSchoolData({
                    schoolName: schoolDetails.school_name,
                    contactNumber: schoolDetails.contact_number,
                    streetAddress: schoolDetails.street_address,
                    wardNumber: schoolDetails.ward_number,
                    municipalityDistrict: schoolDetails.municipality_district,
                    carpoolDropoffStartTime: schoolDetails.carpool_dropoff_start_time,
                    carpoolPickupStartTime: schoolDetails.carpool_pickup_start_time,
                    carpoolDropoffEndTime: schoolDetails.carpool_dropoff_end_time,
                    carpoolPickupEndTime: schoolDetails.carpool_pickup_end_time,
                    carpoolDropoffLocation: schoolDetails.carpool_dropoff_location,
                    carpoolPickupLocation: schoolDetails.carpool_pickup_location
                });
                setServerError("");
                setIsLoading(false);

            } catch (error) {
                console.error(error);
                if (axios.isAxiosError(error) && error.response) {
                    const errorKey = error.response.data.error as SchoolServerErrors;
                    // TODO language support for error messages
                    let errorMessage: string = translations.school_server_errors[errorKey] ?? translations.school_server_errors.generic_error;
                    setServerError(errorMessage);
                }
                setIsLoading(false);
            }
        }

        // Fetch school data from the API using the token
        try {
            if(!!token && !!userId && !!username){
                populateSchoolData(token!, username!, userId!);
                resetErrors();
            }
        } catch (error) {
            console.error(error);
        }

        setIsLoading(false);
    }, [language, token, userId, username, navigate, isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin, apiUrl, translations.school_server_errors]);

    // Function for handling the admin wanting to edit the school's profile
    const handleEditProfile = () => {
        setEditingSchoolData(schoolData);
        setIsViewState(false);
    };

    // Function for handling the admin saving the changes to the school's profile
    const handleSaveProfileChanges = () => {
        editSchoolProfile(editingSchoolData, token!);
    };

    // Function for handling the user canceling their edit
    const handleCancelEdit = () => {
        setEditingSchoolData(schoolData);
        setIsViewState(true);
    }

    // Update values as admin edits the school's data
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditingSchoolData({ ...editingSchoolData, [e.target.name]: e.target.value });
    };

    // Function to reset all error messages
    function resetErrors(){
        setSchoolNameError("");
        setContactNumberError("");
        setStreetAddressError("");
        setWardNumberError("");
        setMunicipalityDistrictError("");
        setCarpoolDropoffStartTimeError("");
        setCarpoolPickupStartTimeError("");
        setCarpoolDropoffEndTimeError("");
        setCarpoolPickupEndTimeError("");
        setCarpoolDropoffLocationError("");
        setCarpoolPickupLocationError("");
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
                <HelpTip content={translations.help.school} altText={translations.universal.help_icon}/>
            </div>
            <h1 className="text-4xl font-bold mb-4">{translations.school.school_header}</h1>
            <h2 className="text-xl text-gray-600 mb-8">{translations.school.school_prompt}</h2>
            {serverError && (
                <div className="text-red-500 text-sm mb-4">{serverError}</div>
            )}
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                {isViewState ? (
                    <div className="mb-4">
                        <CardLabel
                            label={translations.school.school_name_label}
                            data={schoolData.schoolName}
                        />
                    </div>
                ) : (
                    <ProfileInput
                        label={translations.school.school_name_label}
                        elementId="schoolName"
                        value={editingSchoolData.schoolName}
                        changeHandler={handleChange}
                        error={schoolNameError}
                    />
                )}
                
                {isViewState ? (
                    <div className="mb-4">
                        <CardLabel
                            label={translations.profile.street_address_label}
                            data={schoolData.streetAddress}
                        />
                    </div>
                ) : (
                    <ProfileInput
                        label={translations.school.street_address_label}
                        elementId="streetAddress"
                        value={editingSchoolData.streetAddress}
                        changeHandler={handleChange}
                        error={streetAddressError}
                    />
                )}

                {isViewState ? (
                    <div className="mb-4">
                        <CardLabel
                            label={translations.school.ward_label}
                            data={schoolData.wardNumber}
                        />
                    </div>
                ) : (
                    <ProfileInput
                        label={translations.school.ward_label}
                        elementId="wardNumber"
                        value={editingSchoolData.wardNumber? editingSchoolData.wardNumber : ""}
                        changeHandler={handleChange}
                        error={wardNumberError}
                        isNumber={true}
                    />
                )}
                
                {isViewState ? (
                    <div className="mb-4">
                        <CardLabel
                            label={translations.school.municipality_label}
                            data={schoolData.municipalityDistrict}
                        />
                    </div>
                ) : (
                    <ProfileInput
                        label={translations.school.municipality_label}
                        elementId="municipalityDistrict"
                        value={editingSchoolData.municipalityDistrict}
                        changeHandler={handleChange}
                        error={municipalityDistrictError}
                    />
                )}

                {isViewState ? (
                    <div className="mb-4">
                        <CardLabel
                            label={translations.school.contact_number_label}
                            data={schoolData.contactNumber}
                        />
                    </div>
                ) : (
                    <ProfileInput
                        label={translations.school.contact_number_label}
                        elementId="contactNumber"
                        value={editingSchoolData.contactNumber}
                        changeHandler={handleChange}
                        error={contactNumberError}
                        placeholder={translations.sign_up.phone_placeholder}
                        isPhone={true}
                    />
                )}

                {isViewState ? (
                    <div className="mb-4">
                        <CardLabel
                            label={translations.school.carpool_dropoff_start_time_label}
                            data={schoolData.carpoolDropoffStartTime}
                        />
                    </div>
                ) : (
                    <ProfileInput
                        label={translations.school.carpool_dropoff_start_time_label}
                        elementId="carpoolDropoffStartTime"
                        value={editingSchoolData.carpoolDropoffStartTime}
                        changeHandler={handleChange}
                        error={carpoolDropoffStartTimeError}
                    />
                )}

                {isViewState ? (
                    <div className="mb-4">
                        <CardLabel
                            label={translations.school.carpool_dropoff_end_time_label}
                            data={schoolData.carpoolDropoffEndTime}
                        />
                    </div>
                ) : (
                    <ProfileInput
                        label={translations.school.carpool_dropoff_end_time_label}
                        elementId="carpoolDropoffEndTime"
                        value={editingSchoolData.carpoolDropoffEndTime}
                        changeHandler={handleChange}
                        error={carpoolDropoffEndTimeError}
                    />
                )}

                {isViewState ? (
                    <div className="mb-4">
                        <CardLabel
                            label={translations.school.carpool_dropoff_location_label}
                            data={schoolData.carpoolDropoffLocation}
                        />
                    </div>
                ) : (
                    <ProfileInput
                        label={translations.school.carpool_dropoff_location_label}
                        elementId="carpoolDropoffLocation"
                        value={editingSchoolData.carpoolDropoffLocation}
                        changeHandler={handleChange}
                        error={carpoolDropoffLocationError}
                    />
                )}

                 {isViewState ? (
                    <div className="mb-4">
                        <CardLabel
                            label={translations.school.carpool_pickup_start_time_label}
                            data={schoolData.carpoolPickupStartTime}
                        />
                    </div>
                ) : (
                    <ProfileInput
                        label={translations.school.carpool_pickup_start_time_label}
                        elementId="carpoolPickuptartTime"
                        value={editingSchoolData.carpoolPickupStartTime}
                        changeHandler={handleChange}
                        error={carpoolPickupStartTimeError}
                    />
                )}

                {isViewState ? (
                    <div className="mb-4">
                        <CardLabel
                            label={translations.school.carpool_pickup_end_time_label}
                            data={schoolData.carpoolPickupEndTime}
                        />
                    </div>
                ) : (
                    <ProfileInput
                        label={translations.school.carpool_pickup_end_time_label}
                        elementId="carpoolPickupEndTime"
                        value={editingSchoolData.carpoolPickupEndTime}
                        changeHandler={handleChange}
                        error={carpoolPickupEndTimeError}
                    />
                )}

                {isViewState ? (
                    <div className="mb-4">
                        <CardLabel
                            label={translations.school.carpool_pickup_location_label}
                            data={schoolData.carpoolPickupLocation}
                        />
                    </div>
                ) : (
                    <ProfileInput
                        label={translations.school.carpool_pickup_location_label}
                        elementId="carpoolPickupLocation"
                        value={editingSchoolData.carpoolPickupLocation}
                        changeHandler={handleChange}
                        error={carpoolPickupLocationError}
                    />
                )}

            </div>

            <div className="mt-8 w-full max-w-md flex flex-row justify-center">
                {isViewState ? (
                    <div className="flex flex-row w-full max-w-md justify-between space-x-4">
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
        </div>
    );
}