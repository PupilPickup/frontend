import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import VehicleCard from "../../components/VehicleCard";
import axios from "axios";
import Button from "../../components/common/Button";
import HelpTip from "../../components/common/HelpTip";
import { useUser } from "../../context/UserContext";
import PendingPromptModal from "../../components/common/PendingPromptModal";
import { VehicleData } from "../../schema/types";
import { VehicleServerErrors } from "../../schema/serverErrorTypes";

export default function VehicleManagement() {
    const [isLoading, setIsLoading] = useState(true);
    const [vehicle, setVehicle] = useState<VehicleData | null>(null);
    const [serverError, setServerError] = useState<string>("");
    const [showRegisterPrompt, setShowRegisterPrompt] = useState<boolean>(false);
    const [showPendingWarning, setShowPendingWarning] = useState<boolean>(false);

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    const navigate = useNavigate();  
    const token: string | null = sessionStorage.getItem("token");
    const { user, logout, isLoggedIn, typeOfDriver, updateUserRoles } = useUser();
    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    // const adminRole:number  = Number(process.env.ROLE_ADMIN) || 1;
    // const driverRole: number = Number(process.env.ROLE_DRIVER) || 3;
    const pendingDriverRole: number = Number(process.env.ROLE_PENDING_DRIVER) || 5;
    const noRole: number = Number(process.env.ROLE_ROLELESS_USER) || 6;
    const rejectedDriverRole: number = Number(process.env.ROLE_REJECTED_DRIVER) || 8;

    useEffect(() => {
        if(!token || user === null || user === undefined || !isLoggedIn){
            sessionStorage.removeItem("token");
            logout();
            navigate("/"); 
            return;
        }

        async function populateVehicles(token:string, userName:string, userId:string){
            try {
                const response = await axios.get(`${apiUrl}/vehicles`, {
                    headers: {
                        Authorization: "Bearer " + token,
                        user_name: userName,
                        user_id: userId,
                    },
                });
                const vehicleRetrieved = response.data;
                setVehicle(vehicleRetrieved);
                setIsLoading(false);
                setServerError("");

            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    const errorKey = error.response.data.error as VehicleServerErrors;
                    let errorMessage: string = translations.vehicles_server_error[errorKey] ?? translations.vehicles_server_error.generic_error;
                    setServerError(errorMessage);
                }
                setIsLoading(false);
            }
        }
        if(typeOfDriver() === noRole){
            setShowRegisterPrompt(true);
        }

        if(typeOfDriver() === pendingDriverRole){
            setShowPendingWarning(true);
        }

        populateVehicles(token!, user!.username, user!.userId);
        setIsLoading(false);
    }, [token, user, logout, navigate, isLoggedIn, apiUrl, typeOfDriver, noRole, pendingDriverRole, translations.vehicles_server_error]);

    async function deleteVehicleData(token:string, userName:string, userId:string, vehicleId:string) {
        try {
            await axios.delete(`${apiUrl}/vehicles/${vehicleId}`, {
                headers: {
                    Authorization: "Bearer " + token,
                    user_name: userName,
                    user_id: userId,
                },
            });
            
            setVehicle(null)
            setServerError("");

        }catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorKey = error.response.data.error as VehicleServerErrors;
                let errorMessage: string = translations.vehicles_server_error[errorKey] ?? translations.vehicles_server_error.generic_error;
                setServerError(errorMessage);
            }
        }
    }

    function editVehicle(vehicleId: string) {
        // Handle edit action here
        navigate(`/my-vehicles/edit-vehicle-data/${vehicleId}`);
    }

    function deleteVehicle(vehicleId: string) {
        // TODO make user verify choice
        // Handle delete action here
        if(!!token && !!user){
            deleteVehicleData(token, user.username, user.userId, vehicleId);
        }
        // TODO success message
    }

    function handleAddClick(){
        navigate("/my-vehicles/add-vehicle-data")
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
        registerDriver(token!, user!.username, user!.userId);
    }

    async function registerDriver(token:string, userName:string, userId:string) {
        try {
            const response = await axios.post(`${apiUrl}/profile/driver`, {}, {
                headers: {
                    Authorization: "Bearer " + token,
                    user_name: userName,
                    user_id: userId,
                },
            });
            // Update the user roles to include parent role 
            if(response.data && response.data.roles){
                // Update the user roles in the context
                updateUserRoles(response.data.roles);
            }
            setServerError("");
            setShowPendingWarning(true);
            
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorKey = error.response.data.error as VehicleServerErrors;
                let errorMessage: string = translations.vehicles_server_error[errorKey] ?? translations.vehicles_server_error.generic_error;
                setServerError(errorMessage);
            }
            setIsLoading(false);
        }
    }

    if(isLoading){
        return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.loading}</div>
    }

    if(!token){
        return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.redirecting}</div>
    }

    if(typeOfDriver() === rejectedDriverRole){
        return (
            <div className="flex flex-col items-center min-h-[90vh] w-full my-4 px-4">
                <h1 className="text-3xl font-bold mb-4">{translations.vehicles.vehicles_header}</h1>
                <div className="w-full bg-red-500 text-white mb-4 p-4 rounded text-center">{translations.vehicles.rejected_driver_notice}</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-[90vh] w-full my-4 px-4">
            <div className="flex justify-start w-full">
                <HelpTip content={translations.help.view_vehicles} altText={translations.universal.help_icon}/>
            </div>
            <h1 className="text-3xl font-bold mb-4">{translations.vehicles.vehicles_header}</h1>
            <h2>{translations.vehicles.vehicles_prompt}</h2>
            {showPendingWarning && <div className="w-full bg-[#F4D03F] text-black mb-4 p-2 rounded text-center">{translations.vehicles.pending_driver_limitations}</div>}
            {serverError && <div className="text-red-500 mb-4">{serverError}</div>}
            {vehicle !== null ? (
                <div className="flex flex-row justify-center items-stretch">    
                    <VehicleCard 
                        key={vehicle.vehicleId}
                        vehicleId={vehicle.vehicleId}
                        licensePlate={vehicle.licensePlate}
                        seatCapacity={vehicle.seatCapacity}
                        seatsAvailable={vehicle.seatsAvailable}
                        driveStartTime={removeSeconds(vehicle.driverStartTime)}
                        driverEndTime={removeSeconds(vehicle.driverEndTime)}
                        daysAvailable={vehicle.daysAvailable}
                        onEdit={editVehicle}
                        onDelete={deleteVehicle}
                    />
                </div>
            ) : (
                <div className="flex flex-col items-center mt-8">
                    <div className="text-center mt-4">{translations.vehicles.no_vehicles_message}</div>

                    <Button 
                        label={translations.vehicles.add_vehicle_button} 
                        variant="primary" 
                        onClick={handleAddClick} 
                    />
                </div>
            )}
            
            {showRegisterPrompt && 
                <PendingPromptModal 
                    prompt={translations.vehicles.register_prompt} 
                    abortLabel={translations.vehicles.cancel_register_button} 
                    confirmLabel={translations.vehicles.confirm_register_button} 
                    onAbort={handleAbortRegisterPrompt}
                    onConfirm={handleConfirmRegisterPrompt} 
                />
            }
        </div>
    );
}