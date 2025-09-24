import enTranslations from "../languages/en.json";
import neTranslations from "../languages/ne.json";
import { useLanguage } from "../context/LanguageContext";
import VehicleCard from "../components/VehicleCard";
import CardLabel from "./common/CardLabel";
import Button from "./common/Button";

type CarpoolVehicleProps = {
    vehicleId: string;
    licensePlate: string;
    seatCapacity: number;
    seatsAvailable: number;
    driverStartTime: string;
    driverEndTime: string;
    daysAvailable: string | null;
    carpoolStatus: number;
    onStatusChange: (newStatus: number) => void;
};

const CarpoolVehicleInfo: React.FC<CarpoolVehicleProps> = ({
    vehicleId,
    licensePlate,
    seatCapacity,
    seatsAvailable,
    driverStartTime,
    driverEndTime,
    daysAvailable,
    carpoolStatus,
    onStatusChange,

}) => {
    // const [errorMessage, setErrorMessage] = useState<string>("");

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    // const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    function interpretCarpoolStatus(status: number): string {
        switch(status){
            case 0:
                return translations.roles_and_statuses.inactive_status;
            case 1:
                return translations.roles_and_statuses.active_status;
            case 2:
                return translations.roles_and_statuses.completed_status;
            default:
                return translations.roles_and_statuses.status_unknown;
        }   
    }

    function statusButtonLabel(status: number): string {
        if(status === undefined || status === null || isNaN(status) === true || status <= 0){
                return translations.carpool.activate_carpool_button;
        }else{
            return translations.carpool.deactivate_carpool_button;
        }
    }

    function changeCarpoolStatus(){
        if(carpoolStatus === 0){
            onStatusChange(1);
        }else if(carpoolStatus === 1){
            onStatusChange(0)
        }
    }

    return (
        <div className="flex flex-col items-center min-h-[90vh] w-full my-4 px-4">
            <VehicleCard vehicleId={vehicleId || ""}
                licensePlate={licensePlate || ""}
                seatCapacity={seatCapacity || 0}
                seatsAvailable={seatsAvailable || 0}
                driveStartTime={driverStartTime || ""}
                driverEndTime={driverEndTime || ""}
                daysAvailable={daysAvailable || null}
                isCarpool={true}
                onEdit={(vehicleId: string) => {}}
                onDelete={(vehicleId: string) => {}}
            />
            
            <div className="w-full max-w-[20rem] my-4">
                <CardLabel label={translations.carpool.carpool_status_label} data={interpretCarpoolStatus(carpoolStatus)} className="mt-4 ml-0 pl-0"/>
                <Button 
                    onClick={changeCarpoolStatus}
                    variant="primary"
                    label={statusButtonLabel(carpoolStatus)}
                />
            </div>

        </div>
    );
}

export default CarpoolVehicleInfo;