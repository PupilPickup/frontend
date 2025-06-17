import { useEffect, useState } from "react";
import enTranslations from "../languages/en.json";
import neTranslations from "../languages/ne.json";
import { useLanguage } from "../context/LanguageContext";
import Button from "./common/Button";
import CardLabel from "./common/CardLabel";
import DeleteWarningModal from "./common/DeleteWarningModal";

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

// Define the possible day keys
type DaysOfWeek = 'monday_label' | 'tuesday_label' | 'wednesday_label' | 'thursday_label' |'friday_label' |'saturday_label' | 'sunday_label' ;


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

    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const [daysDisplay, setDaysDisplay] = useState("");

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;
    useEffect(() => {

        //Function to display available days nicely 
        function prettyDays(days: string | null){
            if(days === null || days === "" || days === undefined){
                return translations.vehicles.no_days_selected;
            }else{
                const selectedDays = days.split(",");
                if(selectedDays.length === 1){
                    const dayKey = (selectedDays[0].toLowerCase() + "_label") as DaysOfWeek;
                    return translations.vehicles[dayKey];
                }else{
                    let display = "";
                    for(let i: number = 0; i < selectedDays.length; i++){
                        if(i === 0){
                            const dayKey = (selectedDays[i].toLowerCase() + "_label") as DaysOfWeek;
                            display += translations.vehicles[dayKey];
                        }else{
                            const dayKey = (selectedDays[i].toLowerCase() + "_label") as DaysOfWeek;
                            display += ", " + (translations.vehicles[dayKey]);
                        }
                    }
                    return display;
                }
            }
        }
        
        // Update the daysDisplay whenever translations or daysAvailable change
        setDaysDisplay(prettyDays(daysAvailable));
       
    }, [language, translations, daysAvailable]);

    // Function to confirm the delete action
    function confirmDelete(){
        setShowDeleteWarning(true);
    }

    // Function to handle the delete action
    async function handleDelete() {
        setShowDeleteWarning(false);
        // Call the onDelete function passed as a prop
        onDelete(vehicleId);
    }

    // Function to handle cancelling the delete action
    function cancelDelete() {
        setShowDeleteWarning(false);
    }

    return (
        <div className="flex flex-col border rounded-lg shadow-md p-4 my-4 bg-white w-full max-w-[20rem] justify-between">
            <div className="flex flex-col">
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
                    data={daysDisplay}
                    className="flex-col w-full space-x-0"
                />
            </div>
            <div className="mt-4 px-2 flex flex-row w-full justify-between">
                <Button
                    onClick={confirmDelete}
                    variant="secondary"
                    label={translations.vehicles.delete_vehicle_button}
                />
                <Button
                    onClick={() => onEdit(vehicleId)}
                    variant="primary"
                    label={translations.vehicles.edit_vehicle_button}
                />  
            </div>
            {showDeleteWarning && <DeleteWarningModal prompt={translations.vehicles.delete_confirmation_message} abortLabel={translations.vehicles.cancel_button} confirmLabel={translations.vehicles.delete_vehicle_button} onAbort={cancelDelete} onConfirm={handleDelete} />} 
        </div>
    );
};

export default VehicleCard;