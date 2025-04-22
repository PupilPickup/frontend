import React, { use } from "react";
import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VehicleForm from "../../components/VehicleForm";
import { isFieldEmpty, isNumberFieldPresent, isTimeValid, isValidLicensePlate, isValidAvailability, isValidCapacity, isEndAfterStart, isUnderOrAtCapacity } from "../../utils/vehicleValidation";
import axios from "axios";
import Button from "../../components/common/Button";

type EditVehicleDataProps = {
    isLoggedIn: boolean;
};

// Define the possible error keys
type VehiclesServerErrors = 'empty_fields' | 'seat_capacity_invalid' | 'available_seats_invalid' | 'seat_mismatch_error' | 'license_plate_invalid' | 'driver_start_time_invalid' | 'driver_end_time_invalid' | 'server_error_get' | 'server_error_post' | 'server_error_put' | 'server_error_delete' | 'generic_error';


const EditVehicleData: React.FC<EditVehicleDataProps> = ({
    isLoggedIn
}) => {

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

    const token = sessionStorage.getItem("token");
    const username = sessionStorage.getItem("user_name");
    const userId = sessionStorage.getItem("user_id");
    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const navigate = useNavigate();

    // Get the vehicle id
    const { id: vehicleId } = useParams();

    useEffect(() => {
        if(!token || !userId || !username || !isLoggedIn){
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user_name");
            sessionStorage.removeItem("user_id");
            navigate("/"); 
        }else if(!vehicleId){
            navigate("/my-vehicles");
        }else{
            // Fetch vehicle data here and set the state variables
            fetchVehicleData(token, username, userId, vehicleId);
        }
        setIsLoading(false);
        // This effect runs when the component mounts or when the language changes
        // You can add any side effects here if needed
    }, [language, token, userId, username, isLoggedIn, navigate, vehicleId]);

    async function fetchVehicleData(token:string, userName:string, userId:string, vehicleId:string) {
        try {
            const response = await axios.get(`${apiUrl}/vehicles/${vehicleId}`, {
                headers: {
                    Authorization: "Bearer " + token,
                    user_name: userName,
                    user_id: userId,
                },
            });
            const vehicleData = response.data;
            setLicensePlate(vehicleData.licensePlate);
            setSeatCapacity(vehicleData.seatCapacity);
            setSeatsAvailable(vehicleData.seatsAvailable);
            setDriverStartTime(removeSeconds(vehicleData.driverStartTime));
            setDriverEndTime(removeSeconds(vehicleData.driverEndTime));
            setDaysAvailable(vehicleData.daysAvailable);
        }catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorKey = error.response.data.error as VehiclesServerErrors;
                let errorMessage: string = translations.vehilces_server_error[errorKey] ?? translations.vehilces_server_error.generic_error;
                setServerError(errorMessage);
            }
        }
    }

    async function updateVehicleData(token:string, vehicleId:string, vehicleData: any) {
        try {
            const response = await axios.put(`${apiUrl}/vehicles/${vehicleId}`, vehicleData, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            const editedData = response.data;
            setLicensePlate(editedData.licensePlate);
            setSeatCapacity(editedData.seatCapacity);
            setSeatsAvailable(editedData.seatsAvailable);
            setDriverStartTime(removeSeconds(editedData.driverStartTime));
            setDriverEndTime(removeSeconds(editedData.driverEndTime));
            setDaysAvailable(editedData.daysAvailable);
            setServerError("");
            navigate("/my-vehicles");
        }catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorKey = error.response.data.error as VehiclesServerErrors;
                let errorMessage: string = translations.vehilces_server_error[errorKey] ?? translations.vehilces_server_error.generic_error;
                setServerError(errorMessage);
            }
        }
    }

    function handleCancel() {
        navigate("/my-vehicles");
    }

    function handleSave() {
        // TODO Add Vehicle logic here
        if(!validateFields()){
            return;
        }else{
            const vehicleData = {
                userName: username,
                userId: userId,
                licensePlate: licensePlate,
                seatCapacity: seatCapacity,
                availableSeats: seatsAvailable,
                driverStartTime: driverStartTime,
                driverEndTime: driverEndTime,
                daysAvailable: daysAvailable
            }

            updateVehicleData(token!, vehicleId!, vehicleData);
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

    function removeSeconds(timeString: string){
        const sections = timeString.split(":")
        return sections[0] + ":" + sections[1];
        // const size: number = timeString.length;
        // return timeString.substring(0, size-3);
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
                {translations.vehicles.edit_vehicle_prompt}
            </h2>
            {!!serverError && 
               <p className="text-red-500 text-sm">{serverError}</p>
            }
            <VehicleForm
                licensePlate={licensePlate}
                setLicensePlate={setLicensePlate}
                licensePlateError={licensePlateError}
                seatCapacity={seatCapacity}
                setSeatCapacity={setSeatCapacity}
                seatCapacityError={seatCapacityError}
                seatsAvailable={seatsAvailable}
                setSeatsAvailable={setSeatsAvailable}
                seatsAvailableError={seatsAvailableError}
                driveStartTime={driverStartTime}
                setDriveStartTime={setDriverStartTime}
                driveStartTimeError={driverStartTimeError}
                driverEndTime={driverEndTime}
                setDriverEndTime={setDriverEndTime}
                driverEndTimeError={driverEndTimeError}
                daysAvailable={daysAvailable}
                setDaysAvailable={setDaysAvailable}
            />
            <div className="mt-4 flex space-x-4">
                <Button
                    onClick={handleCancel}
                    className="bg-[#F4D03F] hover:bg-[#FFFFFF] text-black px-4 py-2 rounded border-transparent hover:border-black border-2"
                    variant="secondary"
                    label={translations.vehicles.cancel_button}
                />
                <Button
                    onClick={handleSave}
                    className="bg-[#3498DB] hover:bg-[#2C3E50] text-white px-4 py-2 rounded"
                    variant="primary"
                    label={translations.vehicles.save_button}
                />  
            </div>
        </div>
    );
};

export default EditVehicleData;