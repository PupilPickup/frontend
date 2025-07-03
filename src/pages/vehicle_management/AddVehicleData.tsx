import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isFieldEmpty, isNumberFieldPresent, isTimeValid, isValidLicensePlate, isValidAvailability, isValidCapacity, isEndAfterStart, isUnderOrAtCapacity } from "../../utils/vehicleValidation";
import VehicleForm from "../../components/VehicleForm";
import axios from "axios";
import Button from "../../components/common/Button";
import HelpTip from "../../components/common/HelpTip";
import { useUser } from "../../context/UserContext";


// Define the possible error keys
type VehiclesServerErrors = 'empty_fields' | 'seat_capacity_invalid' | 'available_seats_invalid' | 'seat_mismatch_error' | 'license_plate_invalid' | 'driver_start_time_invalid' | 'driver_end_time_invalid' | 'server_error_get' | 'server_error_post' | 'server_error_put' | 'server_error_delete' | 'generic_error';

export default function AddVehicleData(){

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    const [isLoading, setIsLoading] = useState(true);
    const [licensePlate, setLicensePlate] = useState<string>("");
    const [seatCapacity, setSeatCapacity] = useState<number>(1);
    const [seatsAvailable, setSeatsAvailable] = useState<number>(0);
    const [driverStartTime, setDriverStartTime] = useState<string>("");
    const [driverEndTime, setDriverEndTime] = useState<string>("");
    const [daysAvailable, setDaysAvailable] = useState<string|null>(null);
    const [serverError, setServerError] = useState<string>("");
    const [licensePlateError, setLicensePlateError] = useState<string>("");
    const [seatCapacityError, setSeatCapacityError] = useState<string>("");
    const [seatsAvailableError, setSeatsAvailableError] = useState<string>("");
    const [driverStartTimeError, setDriverStartTimeError] = useState<string>("");
    const [driverEndTimeError, setDriverEndTimeError] = useState<string>("");

    const token: string | null = sessionStorage.getItem("token");
    const { user, logout, isLoggedIn } = useUser();
    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const navigate = useNavigate();

    useEffect(() => {
        if(!token || user === null || user === undefined || !isLoggedIn){
            sessionStorage.removeItem("token");
            logout();
            navigate("/"); 
        }
        setIsLoading(false);
        // This effect runs when the component mounts or when the language changes
    }, [language, token, user, logout, isLoggedIn, navigate]);

    // Function to handle cancelling the deletion of a vehicle
    function handleCancel() {
        navigate("/my-vehicles");
    }

    function handleAdd() {
        if(!validateFields()){
            return;
        }else{
            const vehicleData = {
                userName: user!.username,
                userId: user!.userId,
                licensePlate: licensePlate,
                seatCapacity: seatCapacity,
                availableSeats: seatsAvailable,
                driverStartTime: driverStartTime,
                driverEndTime: driverEndTime,
                daysAvailable: daysAvailable
            }
            createVehicleData(token!, vehicleData);
        }
    }


    async function createVehicleData(token:string, vehicleData: any) {
        try {
            const response = await axios.post(`${apiUrl}/vehicles`, vehicleData, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            const createdData = response.data;
            setLicensePlate(createdData.license_plate);
            setSeatCapacity(createdData.seating_capacity);
            setSeatsAvailable(createdData.seats_available);
            setDriverStartTime(createdData.driver_start_time);
            setDriverEndTime(createdData.driver_end_time);
            setDaysAvailable(createdData.available_days)
            navigate("/my-vehicles")
        }catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorKey = error.response.data.error as VehiclesServerErrors;
                let errorMessage: string = translations.vehicles_server_error[errorKey] ?? translations.vehicles_server_error.generic_error;
                setServerError(errorMessage);
            }
        }
    }

    // function to validate the field inputs
    function validateFields() {
        let isValid = true;
        // Licence Plate validation
        if(isFieldEmpty(licensePlate)){
            setLicensePlateError(translations.vehicles.require_license_plate_error);
            isValid = false;
        }else if(!isValidLicensePlate(licensePlate)){
            setLicensePlateError(translations.vehicles.invalid_license_plate_error);
            isValid = false;
        }else{
            setLicensePlateError("");
        }
        // Seat Capacity validation
        if(!isNumberFieldPresent(seatCapacity)){
            setSeatCapacityError(translations.vehicles.require_seat_capacity_error);
            isValid = false;
        }else if(!isValidCapacity(seatCapacity)){
            setSeatCapacityError(translations.vehicles.invalid_seat_capacity_error);
            isValid = false;
        }else{
            setSeatCapacityError("");
        }
        // Seat Availability validation
        if(!isNumberFieldPresent(seatsAvailable)){
            setSeatsAvailableError(translations.vehicles.require_available_seats_error);
            isValid = false;
        }else if(!isValidAvailability(seatsAvailable)){
            setSeatsAvailableError(translations.vehicles.invalid_available_seats_error);
            isValid = false;
        }else{
            setSeatsAvailableError("");
        }
        // Start time validation
        if(isFieldEmpty(driverStartTime)){
            setDriverStartTimeError(translations.vehicles.require_start_time_error);
            isValid = false;
        } else if(!isTimeValid(driverStartTime)){
            setDriverStartTimeError(translations.vehicles.invalid_start_time_error);
            isValid = false;
        }else{
            setDriverStartTimeError("");
        }
        // End time validation
        if(isFieldEmpty(driverEndTime)){
            setDriverEndTimeError(translations.vehicles.require_end_time_error);
            isValid = false;
        }else if(!isTimeValid(driverEndTime)){
            setDriverEndTimeError(translations.vehicles.invalid_end_time_error);
            isValid = false;
        }else{
            setDriverEndTimeError("");
        }

        // Check if availability is less than capacity and that end time is after start time
        if(isValid){
            if(!isUnderOrAtCapacity(seatCapacity, seatsAvailable)){
                setSeatsAvailableError(translations.vehicles.available_exceeds_capacity_error);
                isValid = false;
            }
            if(!isEndAfterStart(driverStartTime, driverEndTime)){
                setDriverStartTimeError(translations.vehicles.start_after_end_error);
                isValid = false;
            }
        }

        return isValid;
    }

    if(isLoading){
        return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.loading}</div>
    }

    if(!token){
        return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.redirecting}</div>
    }

    return (
        <div className="px-4 pb-4 flex flex-col w-full items-center">
            <div className="flex justify-start w-full mt-2 p-1 pl-0">
                <HelpTip content={translations.help.add_vehicle} altText={translations.universal.help_icon}/>
            </div>
            <div className="flex flex-col border rounded-lg shadow-md p-4 my-4 bg-white w-full sm:max-w-[52rem]">
                <h2 className="text-lg font-bold mb-2 sm:text-center">
                    {translations.vehicles.add_vehicle_prompt}
                </h2>
                {!!serverError && 
                <p className="text-red-500 text-sm">{serverError}</p>
                }
                <VehicleForm 
                    licensePlate={licensePlate}
                    seatCapacity={seatCapacity}
                    seatsAvailable={seatsAvailable}
                    driveStartTime={driverStartTime}
                    driverEndTime={driverEndTime}
                    daysAvailable={daysAvailable}
                    setLicensePlate={setLicensePlate}
                    setSeatCapacity={setSeatCapacity}
                    setSeatsAvailable={setSeatsAvailable}
                    setDriveStartTime={setDriverStartTime}
                    setDriverEndTime={setDriverEndTime}
                    setDaysAvailable={setDaysAvailable}
                    licensePlateError={licensePlateError}
                    seatCapacityError={seatCapacityError}
                    seatsAvailableError={seatsAvailableError}
                    driveStartTimeError={driverStartTimeError}
                    driverEndTimeError={driverEndTimeError}
                />
                <div className="mt-4 flex flex-row justify-between space-x-4">
                    <Button
                        onClick={handleCancel}
                        variant="secondary"
                        label={translations.vehicles.cancel_button}
                    />
                    <Button 
                        onClick={handleAdd}
                        variant="primary"
                        label={translations.vehicles.add_vehicle_button}
                    />
                </div>
            </div>
        </div>
    );
};