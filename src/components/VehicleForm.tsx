import React from "react";
import enTranslations from "../languages/en.json";
import neTranslations from "../languages/ne.json";
import { useLanguage } from "../context/LanguageContext";
import { useEffect } from "react";
import DaysCheckBoxes from "./DaysCheckBoxes";

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

    return (
        <div className="border rounded-lg shadow-md p-4 mb-4 bg-white">
            <div>
                <label htmlFor="licensePlate" className="text-sm text-gray-600">{translations.vehicles.license_plate_label}</label>
                <input
                    type="text"
                    name="licensePlate"
                    id="licensePlate"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}  
                    className="border rounded-lg shadow-md p-2 mb-4 w-full"
                />
                {licensePlateError && <p className="text-red-500 text-sm">{licensePlateError}</p>}
            </div>
            <div>
                <label htmlFor="seatCapacity" className="text-sm text-gray-600">{translations.vehicles.seat_capacity_label}</label>
                <input
                    type="number"
                    name="seatCapacity"
                    id="seatCapacity"
                    value={seatCapacity}
                    onChange={(e) => setSeatCapacity(Number(e.target.value))}  
                    className="border rounded-lg shadow-md p-2 mb-4 w-full"
                />
                {seatCapacityError && <p className="text-red-500 text-sm">{seatCapacityError}</p>}
            </div>
            <div>
                <label htmlFor="seatsAvailable" className="text-sm text-gray-600">{translations.vehicles.available_seats_label}</label>
                <input
                    type="number"
                    name="seatsAvailable"
                    id="seatsAvailable"
                    value={seatsAvailable}
                    onChange={(e) => setSeatsAvailable(Number(e.target.value))}  
                    className="border rounded-lg shadow-md p-2 mb-4 w-full"
                />
                {seatsAvailableError && <p className="text-red-500 text-sm">{seatsAvailableError}</p>}
            </div>
            <div>
                <label htmlFor="driveStartTime" className="text-sm text-gray-600">{translations.vehicles.driver_start_time_label}</label>
                <input
                    type="text"
                    name="driveStartTime"
                    id="driveStartTime"
                    value={driveStartTime}
                    onChange={(e) => setDriveStartTime(e.target.value)}  
                    className="border rounded-lg shadow-md p-2 mb-4 w-full"
                />
                {driveStartTimeError && <p className="text-red-500 text-sm">{driveStartTimeError}</p>}
            </div>
            <div>
                <label htmlFor="driverEndTime" className="text-sm text-gray-600">{translations.vehicles.driver_end_time_label}</label>
                <input
                    type="text"
                    name="driverEndTime"
                    id="driverEndTime"
                    value={driverEndTime}
                    onChange={(e) => setDriverEndTime(e.target.value)}  
                    className="border rounded-lg shadow-md p-2 mb-4 w-full"
                />
                {driverEndTimeError && <p className="text-red-500 text-sm">{driverEndTimeError}</p>}
            </div>
            <div>
                <label className="text-sm text-gray-600">{translations.vehicles.days_label}</label>
                <DaysCheckBoxes 
                    mondayLabel={translations.vehicles.monday_label}
                    tuesdayLabel={translations.vehicles.tuesday_label}
                    wednesdayLabel={translations.vehicles.wednesday_label}
                    thursdayLabel={translations.vehicles.thursday_label}
                    fridayLabel={translations.vehicles.friday_label}
                    saturdayLabel={translations.vehicles.saturday_label}
                    sundayLabel={translations.vehicles.sunday_label}
                    daysSelected={daysAvailable}
                    onEdit={setDaysAvailable}
                />
            </div>
        </div>
    );
};

export default VehicleForm;