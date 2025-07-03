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

// Define the possible error keys
type VehicleServerErrors = 'empty_fields' | 'seat_capacity_invalid' | 'available_seats_invalid' | 'seat_mismatch_error' | 'license_plate_invalid' | 'driver_start_time_invalid' | 'driver_end_time_invalid' | 'server_error_get' | 'server_error_post' | 'server_error_put' | 'server_error_delete' | 'generic_error';

export default function VehicleManagement() {
    const [isLoading, setIsLoading] = useState(true);
    const [vehiclesList, setVehiclesList] = useState([]);
    const [serverError, setServerError] = useState<string>("");

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const { user, logout, isLoggedIn } = useUser();
    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    useEffect(() => {
        if(!token || user === null || user === undefined || !isLoggedIn){
            sessionStorage.removeItem("token");
            logout();
            navigate("/"); 
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
                const vehiclesRetrieved = response.data;
                setVehiclesList(vehiclesRetrieved);
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

        populateVehicles(token!, user!.username, user!.userId);
        setIsLoading(false);
    }, [token, user, logout, navigate, isLoggedIn, apiUrl, translations.vehicles_server_error]);

    async function deleteVehicleData(token:string, userName:string, userId:string, vehicleId:string) {
        try {
            await axios.delete(`${apiUrl}/vehicles/${vehicleId}`, {
                headers: {
                    Authorization: "Bearer " + token,
                    user_name: userName,
                    user_id: userId,
                },
            });
            // Filter out the deleted vehicle from the vehiclesList
            setVehiclesList((prevVehiclesList) =>
                prevVehiclesList.filter((vehicle: any) => vehicle.vehicleId !== vehicleId)
            );
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

    if(isLoading){
        return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.loading}</div>
    }

    if(!token){
        return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.redirecting}</div>
    }

    return (
        <div className="flex flex-col items-center min-h-[90vh] w-full my-4 px-4">
            <div className="flex justify-start w-full">
                <HelpTip content={translations.help.view_vehicles} altText={translations.universal.help_icon}/>
            </div>
            <h1 className="text-3xl font-bold mb-4">{translations.vehicles.vehicles_header}</h1>
            <h2>{translations.vehicles.vehicles_prompt}</h2>
            {serverError && <div className="text-red-500 mb-4">{serverError}</div>}
            {vehiclesList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-center items-stretch">
                    {vehiclesList.map((vehicle: any) => (
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
                    ))}
                </div>
            ) : (
                <div className="text-center mt-4">{translations.vehicles.no_vehicles_message}</div>
            )}
            <Button 
                label={translations.vehicles.add_vehicle_button} 
                variant="primary" 
                onClick={handleAddClick} 
            />
        </div>
    );
}