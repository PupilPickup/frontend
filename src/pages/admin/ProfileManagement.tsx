import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { isFieldEmpty, isNameValid, isEmailValid, isPhoneValid, isStreetAddressValid } from "../../utils/profileValidation";
import axios from "axios";
import Button from "../../components/common/Button";
import CardLabel from "../../components/common/CardLabel";
import ProfileInput from "../../components/common/ProfileInput";
import DeleteWarningModal from "../../components/common/DeleteWarningModal";
import HelpTip from "../../components/common/HelpTip";
import { useUser } from "../../context/UserContext";
import AdminPasswordReset from "../../components/common/AdminPasswordResetModal";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";


// Define the possible error keys
type ProfileServerErrors = 'empty_fields' | 'username_not_existent' | 'invalid_credentials' | 'server_error_get' |'server_error_put' |'server_error_delete' | 'generic_error' | 'firstname_length' | 'lastname_length' | 'email_length' | 'phone_length' | 'street_address_length' | 'username_unknown' | 'email_exists';

export default function ProfileManagement () {
    const [isLoading, setIsLoading] = useState(true);
    const[isViewState, setIsViewState] = useState(true);
    const[roles, setRoles] = useState<number[]>([]);
    const [profileData, setProfileData] = useState({
        userName: "",
        userId: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        streetAddress: "",
        latitude: 0,
        longitude: 0,
        adminParentNote: "",
        adminDriverNote: "",
    });
    const [editingProfileData, setEditingProfileData] = useState({
        userName: "",
        userId: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        streetAddress: "",
        latitude: 0,
        longitude: 0,
        adminParentNote: "",
        adminDriverNote: "",
    });
    const [serverError, setServerError] = useState<string>("");
    const [firstNameError, setFirstNameError] = useState<string>("");
    const [lastNameError, setLastNameError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [phoneNumberError, setPhoneNumberError] = useState<string>("");
    const [streetAddressError, setStreetAddressError] = useState<string>("");
    const [parentNoteError, setParentNoteError] = useState<string>("");
    const [driverNoteError, setDriverNoteError] = useState<string>("");
    const [showDeleteWarning, setShowDeleteWarning] = useState<boolean>(false);
    const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);

    // Get the userId from the URL parameters
    const { id: userId } = useParams();

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    const adminRoleId = Number(process.env.ROLE_ADMIN) || 1;
    const parentRoleId = Number(process.env.ROLE_PARENT) || 2;
    const driverRoleId = Number(process.env.ROLE_DRIVER) || 3;
    const pendingParentRoleId = Number(process.env.ROLE_PENDING_PARENT) || 4;
    const pendingDriverRoleId = Number(process.env.PENDING_DRIVER) || 5;
    const noRoleId = Number(process.env.ROLE_ROLELESS_USER) || 6;
    const rejectedParentRoleId = Number(process.env.ROLE_REJECTED_PARENT) || 7;
    const rejectedDriverRoleId = Number(process.env.ROLE_REJECTED_DRIVER) || 8;

    const navigate = useNavigate();
    const token: string | null = sessionStorage.getItem("token");
    const { user, isLoggedIn, logout, isAdmin } = useUser();
    
    /**
     * updateUser is an asynchronous function that takes a validated User data and PUTs it to the server to update the user's profile in the database.
     * 
     * @param {Object}      characterObject 
     * @param {string}      token 
     * 
     */
    const updateUserAsAdmin = async(userProfile:any, adminName:string, adminId:string, token:string) =>{
        try{
            const response = await axios.put(`${apiUrl}/admin/users/${userProfile.userId}`, userProfile, {
                headers: {
                    Authorization: "Bearer " + token,
                    admin_name: adminName,
                    admin_id: adminId,

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
                    latitude: response.data.latitude,
                    longitude: response.data.longitude,
                    adminParentNote: response.data.adminParentNote ?? "",
                    adminDriverNote: response.data.adminDriverNote ?? "",
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

        // Check if there are any errors
        if(hasErrors) {
            return;
        }else{
            // Post updated user data to the server
            updateUserAsAdmin(profileData, user!.username, user!.userId, token!);
        }
    }

    // Function to delete a user's account
    const deleteUserAsAdmin = async (token:string, adminName:string, adminId:string) => {
        try {
            await axios.delete(`${apiUrl}/admin/users/${userId}`, {
                headers: {
                    Authorization: "Bearer " + token,
                    admin_name: adminName,
                    admin_id: adminId,
                },
            });
            setServerError("");
            // TODO show a success message
            // Logout the user and redirect to the login page
            navigate("/user-management");

        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error) && error.response) {
                const errorKey = error.response.data.error as ProfileServerErrors;
                let errorMessage: string = translations.profile_server_errors[errorKey] ?? translations.profile_server_errors.generic_error;
                setServerError(errorMessage);
            }
        }
    }

    const resetUserPassword = async(token:string, adminName:string, adminId:string, userName:string, userId:string, userEmail:string) => {
        const requestData = {
            userId: userId,
            username: userName,
            email: userEmail,
            subject: translations.forgot_password.email_subject,
            body: translations.forgot_password.email_body
        }
      try{
        await axios.put(`${apiUrl}/admin/password`, requestData, {
            headers: {
                Authorization: "Bearer " + token,
                admin_name: adminName,
                admin_id: adminId,

            },
        });
        setServerError("");
        // console.log("no errors in sending");
        
      }catch(error){
        if (axios.isAxiosError(error) && error.response) {
        //   const errorKey = error.response.data.error as ResetPasswordServerErrors;
        //   let errorMessage: string = translations.forgot_password_server_error[errorKey] || translations.forgot_password_server_error.generic_error;
          setServerError(translations.profile.password_reset_failed); 
        }
      }
    }

    useEffect(() => {
        if(!token || user === null || user === undefined || !isLoggedIn){
            sessionStorage.removeItem("token");
            logout();
            navigate("/"); 
            return;
        }

        if(!isAdmin()){
            navigate("/dashboard");
            return;
        }

        if(!userId || userId === undefined){
            navigate("/user-management");
            return;
        }

        async function populateUserDataForAdmin(token:string, adminName:string, adminId:string) {
            try {
                const response = await axios.get(`${apiUrl}/admin/users/${userId}`, {
                    headers: {
                        Authorization: "Bearer " + token,
                        admin_name: adminName,
                        admin_id: adminId,
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
                    latitude: userDetails.latitude,
                    longitude: userDetails.longitude,
                    adminParentNote: userDetails.adminParentNote ?? "",
                    adminDriverNote: userDetails.adminDriverNote ?? "",
                });
                setRoles(userDetails.roles);
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
            if(!!token && !!user && userId){
                populateUserDataForAdmin(token, user.username, user.userId);
                resetErrors();
            }
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    }, [language, token, user, navigate, isLoggedIn, logout, apiUrl, translations.profile_server_errors, isAdmin, userId]);

    // Function for handling the user wanting to edit their profile
    const handleEditProfile = () => {
        setEditingProfileData(profileData);
        setIsViewState(false);
    };

    // Function for handling the user wanting to change their password
    const confirmChangePassword = () => {
       setShowPasswordModal(true);
    };

    // Function to display a confirmation dialog before deleting the account
    const confirmDelete = () => {
        setShowDeleteWarning(true);
    }

    // Function to handle the user cancelling their decision to delete their account
    const cancelDelete = () => {
        setShowDeleteWarning(false);
    }

    // Function to handle the user cancelling their decision to reset the users password
    const cancelPasswordChange = () => {
        setShowPasswordModal(false);
    }

    // Function for handling the user wanting to delete their account
    const handleDeleteAccount = async () => {
        // Call the deleteUser function to delete the account
        setShowDeleteWarning(false);
        deleteUserAsAdmin(token!, user!.username, user!.userId);
        
    };

    // function for handling changing the user's password
    const handleChangePassword = async(email: string) => {
        setShowPasswordModal(false);
        resetUserPassword(token!, user!.username, user!.userId, profileData.userName, profileData.userId, email);
    
    }

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

    // Function to change a user's parent or driver status
    const changeUserRole = async (token:string, adminName:string, adminId:string, username:string, newStatus:number, oldStatus:number) => {
        const requestBody = {
            userName: username, 
            userId: userId, 
            currRoleId: oldStatus, 
            updatedRoleId: newStatus
        }
        try {
            const response = await axios.put(`${apiUrl}/admin/roles/change`, requestBody, {
                headers: {
                    Authorization: "Bearer " + token,
                    admin_name: adminName,
                    admin_id: adminId,
                },
            });
            if(!!response.data){
                const updatedRoles = roles.filter(role => role !== oldStatus);
                if (!updatedRoles.includes(newStatus)) {
                    updatedRoles.push(newStatus);
                }
                setRoles(updatedRoles);
                setServerError("");
            }

        }catch(error){
            console.error(error);
            if (axios.isAxiosError(error) && error.response) {
                const errorKey = error.response.data.error as ProfileServerErrors;
                let errorMessage: string = translations.profile_server_errors[errorKey] ?? translations.profile_server_errors.generic_error;
                setServerError(errorMessage);
            }
        }
    }

    // Function to make a user an admin
    const giveAdminAccess = async (token:string, adminName:string, adminId:string, userName:string) => {
        const requestBody = {
            userName: userName,
            userId: userId,
        }
        try {
            const response = await axios.post(`${apiUrl}/admin/roles/admin`, requestBody, {
                headers: {
                    Authorization: "Bearer " + token,
                    admin_name: adminName,
                    admin_id: adminId,
                },
            });
            if(!!response.data){
                const updatedRoles = roles.filter(role => role !== noRoleId);
                if (!updatedRoles.includes(adminRoleId)) {
                    updatedRoles.push(adminRoleId);
                }
                setRoles(updatedRoles);
                setServerError("");
            }

        }catch(error){
            console.error(error);
            if (axios.isAxiosError(error) && error.response) {
                const errorKey = error.response.data.error as ProfileServerErrors;
                let errorMessage: string = translations.profile_server_errors[errorKey] ?? translations.profile_server_errors.generic_error;
                setServerError(errorMessage);
            }
        }
    } 

    const handleApproveParent = async() => {
        const oldStatus = (roles.includes(pendingParentRoleId)? pendingParentRoleId : rejectedParentRoleId)
        changeUserRole(token!, user!.username, user!.userId, profileData.userName, parentRoleId, oldStatus);
    }

    const handleRejectParent = async() => {
        const oldStatus = (roles.includes(pendingParentRoleId)? pendingParentRoleId : parentRoleId)
        changeUserRole(token!, user!.username, user!.userId, profileData.userName, rejectedParentRoleId, oldStatus);
    }

    const handleApproveDriver = async() => {
        const oldStatus = (roles.includes(pendingDriverRoleId)? pendingDriverRoleId : rejectedDriverRoleId)
        changeUserRole(token!, user!.username, user!.userId, profileData.userName, driverRoleId, oldStatus);
    }

    const handleRejectDriver = async() => {
        const oldStatus = (roles.includes(pendingDriverRoleId)? pendingDriverRoleId : driverRoleId)
        changeUserRole(token!, user!.username, user!.userId, profileData.userName, rejectedDriverRoleId, oldStatus);
    }

    const handleMakeAdmin = async() => {
        giveAdminAccess(token!, user!.username, user!.userId, profileData.userName);
    }

    // Function to reset all error messages
    function resetErrors(){
        setFirstNameError("");
        setLastNameError("");
        setEmailError("");
        setPhoneNumberError("");
        setStreetAddressError("");
        setParentNoteError("");
        setDriverNoteError("");
        setServerError("");
    }

    // function prettyRoles(roleIds: number[]):string {
    //     if(!roleIds || roleIds.length === 0 || (roleIds.length === 1 && roleIds[0] === noRoleId)){
    //         return translations.roles_and_statuses.no_roles;
    //     }else{
    //         const roleMap: { [key: number]: string } = {
    //             [Number(process.env.ROLE_ADMIN) || 1]: translations.roles_and_statuses.admin,
    //             [Number(process.env.ROLE_PARENT) || 2]: translations.roles_and_statuses.accepted_parent,
    //             [Number(process.env.ROLE_PENDING_PARENT) || 4]: translations.roles_and_statuses.pending_parent,
    //             [Number(process.env.ROLE_DRIVER) || 3]: translations.roles_and_statuses.accepted_driver,
    //             [Number(process.env.ROLE_PENDING_DRIVER) || 5]: translations.roles_and_statuses.pending_driver,
    //             [Number(process.env.ROLE_REJECTED_PARENT) || 7]: translations.roles_and_statuses.rejected_parent,
    //             [Number(process.env.ROLE_REJECTED_DRIVER) || 8]: translations.roles_and_statuses.rejected_driver,

    //         };

    //         // Build the string of role names
    //         const roleNames: string[] = [];
    //         for (const roleId of roleIds) {
    //             if (roleMap[roleId]) {
    //                 roleNames.push(roleMap[roleId]);
    //             }
    //         }

    //         return roleNames.length > 0 ? roleNames.join(", ") : translations.roles_and_statuses.no_roles;

    //     }
        
    // }

    // Function that displays text based on the user's admin status
    function getAdminStatusMsg(roleIds: number[]): string {
        if(roleIds.includes(adminRoleId)){
            return translations.roles_and_statuses.confirm_positive;
        }else{
            return translations.roles_and_statuses.confirm_negative;
        }
    }

    // Function that displays text based on the user's parent status
    function getParentStatusMsg(roleIds: number[]): string {
        if(roleIds.includes(adminRoleId)){
            return translations.roles_and_statuses.admin;
        }else if(roleIds.includes(parentRoleId)){
            return translations.roles_and_statuses.accepted_parent;
        }else if(roleIds.includes(pendingParentRoleId)){
            return translations.roles_and_statuses.pending_parent;
        }else if(roleIds.includes(rejectedParentRoleId)){
            return translations.roles_and_statuses.rejected_parent;
        }else{
            return translations.roles_and_statuses.not_applicable;
        }
    }

    // Function that displays text based on the user's driver status
    function getDriverStatusMsg(roleIds: number[]): string {
        if(roleIds.includes(adminRoleId)){
            return translations.roles_and_statuses.admin;
        }else if(roleIds.includes(driverRoleId)){
            return translations.roles_and_statuses.accepted_driver;
        }else if(roleIds.includes(pendingDriverRoleId)){
            return translations.roles_and_statuses.pending_driver;
        }else if(roleIds.includes(rejectedDriverRoleId)){
            return translations.roles_and_statuses.rejected_driver;
        }else{
            return translations.roles_and_statuses.not_applicable;
        }
    }

    const handleSearch = async () => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(editingProfileData.streetAddress)}`;

        const res = await fetch(url, {
        headers: { "User-Agent": "CarpoolApp/1.0 (pupilpickup@gmail.com)" }, // required by Nominatim
        });
        const data = await res.json();

        if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setEditingProfileData({ ...editingProfileData, latitude: lat, longitude: lon });
        setStreetAddressError("");
        } else {
        setStreetAddressError(translations.sign_up.address_not_found_error);
        }
    }

    function MapUpdater({ position }: { position: [number, number] }) {
        const map = useMap();
        useEffect(() => {
            map.setView(position, map.getZoom());
        }, [position, map]);
        return null;
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
                <HelpTip content={translations.help.admin_profile} altText={translations.universal.help_icon}/>
            </div>
            <h1 className="text-4xl font-bold mb-4">{translations.profile.admin_profile_header} {profileData.userName}</h1>
            <h2 className="text-xl text-gray-600 dark:text-white mb-8">{translations.profile.admin_profile_prompt}</h2>
            {serverError && (
                <div className="text-red-500 text-sm mb-4">{serverError}</div>
            )}
            <div className="w-full flex flex-col sm:flex-row">
                <div className="w-full sm:max-w-[67%] max-w-md bg-white dark:bg-[#3498DB] shadow-md rounded-lg p-6">
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
                        <div>
                            <ProfileInput
                                label={translations.profile.street_address_label}
                                elementId="streetAddress"
                                value={editingProfileData.streetAddress}
                                changeHandler={handleChange}
                                error={streetAddressError}
                            />
                            <Button 
                                label={translations.sign_up.search_button} 
                                variant="secondary" className="w-full p-2 rounded-md" 
                                onClick={handleSearch} 
                            />
                            <div className="w-full my-4">
                                <MapContainer
                                    center={[editingProfileData.latitude, editingProfileData.longitude]}
                                    zoom={14}
                                    style={{ height: "500px", width: "100%", marginBottom: "1rem", marginTop: "1rem", paddingBottom: "1rem", paddingTop: "1rem" }}
                                >
                                    <MapUpdater position={[editingProfileData.latitude, editingProfileData.longitude]} />
                                    <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[editingProfileData.latitude, editingProfileData.longitude]}>
                                    <Popup>Result: {editingProfileData.streetAddress}</Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </div>
                    )}

                    <div className={`flex flex-row text-sm sm:text-base text-black dark:text-white mb-4 space-x-2 ${isViewState ? "m-1 p-2 mb-4" : "m-0 p-0"}`}>
                        <p className="font-bold">{translations.profile.admin_status_label}</p>
                        <p>{getAdminStatusMsg(roles)}</p>
                    </div>
                    <div className={`flex flex-row text-sm sm:text-base text-black dark:text-white mb-4 space-x-2 ${isViewState ? "m-1 p-2 mb-4" : "m-0 p-0"}`}>
                        <p className="font-bold">{translations.profile.parent_status_label}</p>
                        <p>{getParentStatusMsg(roles)}</p>
                    </div>
                    {isViewState ? (
                        <div className="mb-4">
                            <CardLabel
                                label={translations.profile.admin_parent_note_label}
                                data={profileData.adminParentNote}
                                className="flex-col"
                            />
                        </div>
                    ) : (
                        <ProfileInput
                            label={translations.profile.admin_parent_note_label}
                            elementId="adminParentNote"
                            value={editingProfileData.adminParentNote}
                            changeHandler={handleChange}
                            error={parentNoteError}
                            isTextarea={true}
                        />
                    )}
                    <div className={`flex flex-row text-sm sm:text-base text-black dark:text-white mb-4 space-x-2 ${isViewState ? "m-1 p-2 mb-4" : "m-0 p-0"}`}>
                        <p className="font-bold">{translations.profile.driver_status_label}</p>
                        <p>{getDriverStatusMsg(roles)}</p>
                    </div>
                    {isViewState ? (
                        <div className="mb-4">
                            <CardLabel
                                label={translations.profile.admin_driver_note_label}
                                data={profileData.adminDriverNote}
                                className="flex-col"
                            />
                        </div>
                    ) : (
                        <ProfileInput
                            label={translations.profile.admin_driver_note_label}
                            elementId="adminDriverNote"
                            value={editingProfileData.adminDriverNote}
                            changeHandler={handleChange}
                            error={driverNoteError}
                            isTextarea={true}
                        />
                    )}
                </div>

                <div className="mt-8 sm:mt-4 w-full sm:w-[25%] sm:ml-4 max-w-md flex flex-row justify-center">
                    {isViewState ? (
                        <div className="flex flex-col w-full max-w-md justify-between sm:justify-start gap-y-2 sm:gap-y-4">
                            <Button
                                onClick={handleEditProfile}
                                variant="primary"
                                label={translations.profile.edit_button}
                            />
                            {(roles.includes(pendingParentRoleId) || roles.includes(rejectedParentRoleId)) && (
                                <Button
                                    onClick={handleApproveParent}
                                    variant="primary"
                                    label={translations.profile.approve_parent_button}
                                />
                            )}
                            {(roles.includes(pendingParentRoleId) || roles.includes(parentRoleId)) && (
                                <Button
                                    onClick={handleRejectParent}
                                    variant="primary"
                                    label={translations.profile.reject_parent_button}
                                />
                            )}
                            {(roles.includes(pendingDriverRoleId) || roles.includes(rejectedDriverRoleId)) && (
                                <Button
                                    onClick={handleApproveDriver}
                                    variant="primary"
                                    label={translations.profile.approve_driver_button}
                                />
                            )}
                            {(roles.includes(pendingDriverRoleId) || roles.includes(driverRoleId)) && (
                                <Button
                                    onClick={handleRejectDriver}
                                    variant="primary"
                                    label={translations.profile.reject_driver_button}
                                />
                            )}
                            <Button
                                onClick={confirmChangePassword}
                                variant="primary"
                                label={translations.profile.change_password_button}
                            />
                            {(!roles.includes(adminRoleId)) && (
                                <Button
                                    onClick={handleMakeAdmin}
                                    variant="secondary"
                                    label={translations.profile.admin_access_button}
                                />
                            )}
                            <Button
                                onClick={confirmDelete}
                                variant="secondary"
                                label={translations.profile.delete_button}
                            />
                        </div>
                    ):(
                        <div className="flex flex-col w-full max-w-md justify-between sm:justify-start gap-y-2 sm:gap-y-4">
                            <Button
                                onClick={handleSaveProfileChanges}
                                variant="primary"
                                label={translations.profile.save_button}
                            />
                             <Button
                                onClick={handleCancelEdit}
                                variant="secondary"
                                label={translations.profile.cancel_button}
                            />
                        </div>
                    )}
                </div>
            </div>
            {showDeleteWarning &&  
                <DeleteWarningModal 
                    prompt={translations.profile.delete_confirmation_message} 
                    abortLabel={translations.profile.cancel_button} 
                    confirmLabel={translations.profile.delete_button} 
                    onAbort={cancelDelete} 
                    onConfirm={handleDeleteAccount} 
                />
            }
            {showPasswordModal &&  
                <AdminPasswordReset 
                    prompt={translations.profile.reset_password_message} 
                    abortLabel={translations.profile.cancel_button} 
                    confirmLabel={translations.profile.reset_password_button} 
                    email={profileData.email} 
                    emailError={translations.profile.invalid_email_error} 
                    emailLabel={translations.profile.email_label}
                    onAbort={cancelPasswordChange}
                    onConfirm={handleChangePassword}
                 />
            }
        </div>
    );
}