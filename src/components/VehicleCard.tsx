import React from "react";
import enTranslations from "../languages/en.json";
import neTranslations from "../languages/ne.json";
import { useLanguage } from "../context/LanguageContext";
import Button from "./common/Button";
import CardLabel from "./common/CardLabel";
//import { useEffect, useState } from "react";

type VehicleCardProps = {
    vehicleId: string;
    licensePlate: string;
    seatCapacity: number;
    seatsAvailable: number;
    driveStartTime: string;
    driverEndTime: string;
    daysAvailable: string | null;
    onEdit: (vehicleId: string) => void;
    onDelete: (vehicleId: string) => void;
};

const VehicleCard: React.FC<VehicleCardProps> = ({
    vehicleId,
    licensePlate,
    seatCapacity,
    seatsAvailable,
    driveStartTime,
    driverEndTime,
    daysAvailable,
    onEdit,
    onDelete,
}) => {

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    //Function to display available days nicely 
    function prettyDays(days: string | null){
        if(days === null || days === "" || days === undefined){
            return translations.vehicles.no_days_selected;
        }else{
            const selectedDays = days.split(",");
            if(selectedDays.length === 1){
                return selectedDays[0];
            }else{
                let display = "";
                for(let i: number = 0; i < selectedDays.length; i++){
                    if(i === 0){
                        display += selectedDays[i];
                    }else{
                        display += ", " + selectedDays[i];
                    }
                }
                return display;
            }
        }
    }

    return (
        <div className="border rounded-lg shadow-md p-4 mb-4 bg-white">
            <div>
                <CardLabel 
                    label={translations.vehicles.license_plate_label}
                    data={licensePlate} 
                />
                <CardLabel 
                    label={translations.vehicles.seat_capacity_label}
                    data={seatCapacity} 
                />
                <CardLabel 
                    label={translations.vehicles.available_seats_label}
                    data={seatsAvailable} 
                />
                <CardLabel 
                    label={translations.vehicles.driver_start_time_label}
                    data={driveStartTime} 
                />
                <CardLabel 
                    label={translations.vehicles.driver_end_time_label}
                    data={driverEndTime} 
                />
                <CardLabel 
                    label={translations.vehicles.days_label}
                    data={prettyDays(daysAvailable)} 
                />
            </div>
            <div className="mt-4 flex space-x-4">
                <Button
                    onClick={() => onDelete(vehicleId)}
                    className="bg-[#F4D03F] hover:bg-[#FFFFFF] text-black px-4 py-2 rounded border-transparent hover:border-black border-2"
                    variant="secondary"
                    label={translations.vehicles.delete_vehicle_button}
                />
                <Button
                    onClick={() => onEdit(vehicleId)}
                    className="bg-[#3498DB] hover:bg-[#2C3E50] text-white px-4 py-2 rounded"
                    variant="primary"
                    label={translations.vehicles.edit_vehicle_button}
                />  
            </div>
        </div>
    );
};

export default VehicleCard;