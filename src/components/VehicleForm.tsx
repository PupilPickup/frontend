import React from "react";
import enTranslations from "../languages/en.json";
import neTranslations from "../languages/ne.json";
import { useLanguage } from "../context/LanguageContext";
import { useEffect } from "react";
import DaysCheckBoxes from "./DaysCheckBoxes";
import FormInput from "./common/FormInput";
import FormNumberInput from "./common/FormNumberInput";

type VehicleFormProps = {
    licensePlate: string;
    seatCapacity: number;
    seatsAvailable: number;
    driveStartTime: string;
    driverEndTime: string;
    daysAvailable: string | null;
    setLicensePlate: (value: string) => void;
    setSeatCapacity: (value: number) => void;
    setSeatsAvailable: (value: number) => void;
    setDriveStartTime: (value: string) => void;
    setDriverEndTime: (value: string) => void;
    setDaysAvailable: (value: string) => void;
    licensePlateError: string;
    seatCapacityError: string;
    seatsAvailableError: string;
    driveStartTimeError: string;
    driverEndTimeError: string;
};

const VehicleForm: React.FC<VehicleFormProps> = ({
    licensePlate,
    seatCapacity,
    seatsAvailable,
    driveStartTime,
    driverEndTime,
    daysAvailable,
    setLicensePlate,
    setSeatCapacity,
    setSeatsAvailable,
    setDriveStartTime,
    setDriverEndTime,
    setDaysAvailable,
    licensePlateError,
    seatCapacityError,
    seatsAvailableError,
    driveStartTimeError,
    driverEndTimeError,

}) => {

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    useEffect(() => {
        // This effect runs when the component mounts or when the language changes
        // You can add any side effects here if needed
    }, [language]);

    const handleDaysEdit = (updatedDays: string) => {
        setDaysAvailable(updatedDays);
    }

    return (
        <div className="border rounded-lg shadow-md p-4 mb-4 bg-white">
            <FormInput
                label={translations.vehicles.license_plate_label}
                elementId="licensePlate"
                changeHandler={setLicensePlate}
                value={licensePlate}
                error={licensePlateError}
            />
            <FormNumberInput
                label={translations.vehicles.seat_capacity_label}
                elementId="seatCapacity"
                changeHandler={setSeatCapacity}
                value={seatCapacity}
                error={seatCapacityError}
            />
            <FormNumberInput
                label={translations.vehicles.available_seats_label}
                elementId="seatsAvailable"
                changeHandler={setSeatsAvailable}
                value={seatsAvailable}
                error={seatsAvailableError}
            />
            <FormInput
                label={translations.vehicles.driver_start_time_label}
                elementId="driveStartTime"
                changeHandler={setDriveStartTime}
                value={driveStartTime}
                error={driveStartTimeError}
            />
            <FormInput
                label={translations.vehicles.driver_end_time_label}
                elementId="driverEndTime"
                changeHandler={setDriverEndTime}
                value={driverEndTime}
                error={driverEndTimeError}
            />
            <div>
                <label className="text-sm sm:text-base text-black">{translations.vehicles.days_prompt_label}</label>
                <DaysCheckBoxes 
                    mondayLabel={translations.vehicles.monday_label}
                    tuesdayLabel={translations.vehicles.tuesday_label}
                    wednesdayLabel={translations.vehicles.wednesday_label}
                    thursdayLabel={translations.vehicles.thursday_label}
                    fridayLabel={translations.vehicles.friday_label}
                    saturdayLabel={translations.vehicles.saturday_label}
                    sundayLabel={translations.vehicles.sunday_label}
                    daysSelected={daysAvailable}
                    onEdit={handleDaysEdit}
                />
            </div>
        </div>
    );
};

export default VehicleForm;