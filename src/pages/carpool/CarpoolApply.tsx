import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import HelpTip from "../../components/common/HelpTip";
import { useUser } from "../../context/UserContext";
import { CarpoolServerErrors } from "../../schema/serverErrorTypes";
import { MinimalChildData, VehicleData } from "../../schema/types";
import VehicleCard from "../../components/VehicleCard";
import Button from "../../components/common/Button";
import SuccessModal from "../../components/common/SuccessModal";

export default function CarpoolApply () {
    const [isLoading, setIsLoading] = useState(true);
    const [carpoolInfo, setCarpoolInfo] = useState<VehicleData | null>(null);
    const [childList, setChildList] = useState<MinimalChildData[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;
    const approvedParentId: number = Number(process.env.ROLE_PARENT_ID) || 2;
    const { id: vehicleId } = useParams();

    const navigate = useNavigate();
    const token: string | null = sessionStorage.getItem("token");
    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    const { user, logout, isAdmin, isLoggedIn, typeOfParent } = useUser();

    useEffect(() => {
        if(!token || !isLoggedIn || user === null || user === undefined || vehicleId === undefined){
            sessionStorage.removeItem("token");
            logout();
            navigate("/");
            return;
        }

        if(typeOfParent() !== Number(approvedParentId) && !isAdmin()){
            navigate("/dashboard");
        }

        async function fetchCarpoolData(token:string, userName:string, userId:string, vehicleId: string) {
            try {
                const response = await axios.get(`${apiUrl}/vehicles/carpool/${vehicleId}`, {
                    headers: {
                        Authorization: "Bearer " + token,
                        user_name: userName,
                        user_id: userId,
                    },
                    
                });
                const retrievedCarpoolVehicle = response.data;
                //Filter out the current user from the list
                const carpoolVehicle: VehicleData = retrievedCarpoolVehicle;
                setCarpoolInfo(carpoolVehicle);
                setIsLoading(false);
                setErrorMessage("");

            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    const errorKey = error.response.data.error as CarpoolServerErrors;
                    let errorMessage: string = "TODO" + errorKey;
                    setErrorMessage(errorMessage);
                    console.error(error);
                }
                setIsLoading(false);
            }
        }

        async function fetchChildList(token:string, userName:string, userId:string) {
            try {
                const response = await axios.get(`${apiUrl}/children`, {
                    headers: {
                        Authorization: "Bearer " + token,
                        user_name: userName,
                        user_id: userId,
                    },
                    
                });
                const retrievedChildren: MinimalChildData[] = response.data.map((child: any) => ({
                    childId: child.childId,
                    firstName: child.firstName,
                    lastName: child.lastName,
                }));
                setChildList(retrievedChildren);
                setIsLoading(false);
                setErrorMessage("");
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    const errorKey = error.response.data.error as CarpoolServerErrors;
                    let errorMessage: string = "TODO" + errorKey;
                    setErrorMessage(errorMessage);
                    console.error(error);
                }
            }
        }         

        fetchCarpoolData(token!, user!.username, user!.userId, vehicleId!);
        fetchChildList(token!, user!.username, user!.userId);
        // Set the initial display user list to the full user list except for the current user
        setIsLoading(false);
    }, [token, user, isLoggedIn, logout, navigate, isAdmin, typeOfParent, approvedParentId, vehicleId, apiUrl, translations.carpool_server_error]);

    //function to handle the apply action
    async function handleApply(){
        setErrorMessage("");
        if(selectedChildId === ""){
            setErrorMessage(translations.carpool.select_child_error);
            return;
        }

        submitApplication(token!, user!.username, user!.userId, { childId: selectedChildId, driverId: carpoolInfo!.driverId, vehicleId: carpoolInfo!.vehicleId });
    }
    
    async function submitApplication(token:string, userName:string, userId:string, registrationData:any){
        try {
            await axios.post(`${apiUrl}/carpool/applicant`, registrationData, {
                headers: {
                    Authorization: "Bearer " + token,
                    user_name: userName,
                    user_id: userId,
                },
            });

            setErrorMessage("");
            setShowSuccessModal(true);
        }catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorKey = error.response.data.error as CarpoolServerErrors;
                let errorMessage: string = translations.carpool_server_error[errorKey] ?? translations.vehicles_server_error.generic_error;
                setErrorMessage(errorMessage);
            }
        }
    }

    // function to close the success modal
    function closeSuccessModal(){
        setShowSuccessModal(false);
        navigate("/carpool-search");
    }


    // function to handle the cancel action
    function handleCancel(){
        navigate("/carpool-search"); // Redirect to the carpool search page
    };

    if(isLoading){
        return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.loading}</div>
    }

    if(!token){
        return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.redirecting}</div>
    }

    return (
        <div className="flex flex-col items-center min-h-[90vh] w-full my-4 px-4">
            <div className="flex justify-start w-full">
                <HelpTip content={translations.help.carpool_details} altText={translations.universal.help_icon}/>
            </div>
            <h1 className="text-3xl font-bold mb-4">{translations.carpool.carpool_details}</h1>
            <h2>{translations.carpool.carpool_details_prompt}</h2>
            {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
            <VehicleCard vehicleId={carpoolInfo?.vehicleId || ""}
                licensePlate={carpoolInfo?.licensePlate || ""}
                seatCapacity={carpoolInfo?.seatCapacity || 0}
                seatsAvailable={carpoolInfo?.seatsAvailable || 0}
                driveStartTime={carpoolInfo?.driverStartTime || ""}
                driverEndTime={carpoolInfo?.driverEndTime || ""}
                daysAvailable={carpoolInfo?.daysAvailable || null}
                isCarpool={true}
                onEdit={(vehicleId: string) => {}}
                onDelete={(vehicleId: string) => {}}
            />

            <div className="flex flex-row items-center mt-4 space-x-4 w-full sm:w-[50%]">
                {/* Make a dropdown of the user's children */}
                <label htmlFor="childDropdown" className={`font-bold text-sm sm:text-base text-black dark:text-white space-x-2 sm:space-x-1 sm:w-[35%]`}>{translations.carpool.select_child}</label>
                <select
                    id="childDropdown" 
                    className="border rounded-lg shadow-md p-2 sm:w-[62.5%] text-left bg-white text-black dark:bg-[#3498DB] dark:text-white"
                    onChange={(e) => setSelectedChildId(e.target.value)}
                    value={selectedChildId}
                >
                    <option value="">{translations.carpool.select_child}</option>
                    {childList.map((child) => (
                        <option key={child.childId} value={child.childId}>
                            {child.firstName} {child.lastName}  
                        </option>
                    ))}
                    
                </select>   
            </div>
            <div className="flex flex-row mt-4 space-x-4">
                <Button 
                    onClick={handleCancel}
                    variant="secondary"
                    label={translations.universal.cancel}
                 />
                <Button 
                    onClick={handleApply}
                    variant="primary"
                    label={translations.universal.apply}
                 />
            </div>
            {showSuccessModal && <SuccessModal message={translations.carpool.successful_application} buttonLabel={translations.universal.ok} onAction={closeSuccessModal} />} 
        </div>
    );
}