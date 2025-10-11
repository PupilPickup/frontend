import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import HelpTip from "../../components/common/HelpTip";
import { useUser } from "../../context/UserContext";
import CarpoolVehicleInfo from "../../components/CarpoolVehicleInfo";
import { Absence, CarpoolData, VehicleData } from "../../schema/types";
import axios from "axios";
import { CarpoolServerErrors } from "../../schema/serverErrorTypes";
import { DateRange } from "react-day-picker";
import DriverAbsences from "../../components/DriverAbsences";

export default function CarpoolManagement () {
    const [isLoading, setIsLoading] = useState(true);
    const [viewState, setViewState] = useState<'my_carpool' | 'my_absences' | 'my_passengers' | 'carpool_applications'>('my_carpool');
    const [carpoolStatus, setCarpoolStatus] = useState<number>(1);
    const [carpoolData, setCarpoolData] = useState<CarpoolData[]>([]);
    const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
    const [absenceData, setAbsenceData] = useState<Absence[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    const navigate = useNavigate();
    const token: string | null = sessionStorage.getItem("token");
    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const approvedDriverId: number = Number(process.env.ROLE_APPROVED_DRIVER_ID) || 3;

    const { user, logout, isAdmin, typeOfDriver, isLoggedIn } = useUser();

    // --- TAB LABELS ---
    const tabs = [
        { key: 'my_carpool', label: translations.carpool.my_carpool_tab },
        { key: "my_absences", label: translations.carpool.my_absences_tab },
        { key: 'my_passengers', label: translations.carpool.my_passengers_tab },
        { key: 'carpool_applications', label: translations.carpool.carpool_applications_tab }
    ];

    useEffect(() => {
        if(!token || !isLoggedIn || user === null || user === undefined){
            sessionStorage.removeItem("token");
            logout();
            navigate("/");
            return;
        }

        if(!isAdmin() && typeOfDriver() !== Number(approvedDriverId)){
            navigate("/dashboard");
            return;
        }

        async function fetchCarpoolData(token:string, userName:string, userId:string) {
            try {
                const response = await axios.get(`${apiUrl}/carpool/${userId}`, {
                    headers: {
                        Authorization: "Bearer " + token,
                        user_name: userName,
                        user_id: userId,
                    },
                    
                });
                
                const retrievedCarpools: any[] = response.data.carpool;
                if(retrievedCarpools.length > 0){
                    const myCarpool = retrievedCarpools[0];
                    const testCarpool: CarpoolData = {
                        carpoolId: myCarpool.carpool_id,
                        driverId: myCarpool.driver_id,
                        parentId: myCarpool.parent_id,
                        childId: myCarpool.child_id,
                        vehicleId: myCarpool.vehicle_id,
                        seatCapacity: myCarpool.seat_capacity,
                        seatsAvailable: myCarpool.seats_available,
                        driverStartTime: myCarpool.driver_start_time,
                        driverEndTime: myCarpool.driver_end_time,
                        daysAvailable: myCarpool.days_available,
                        activeStatus: myCarpool.carpool_status,
                        childAcceptanceStatus: myCarpool.application_status,
                        licensePlate: myCarpool.license_plate,
                        driverFirstName: myCarpool.driver_first_name,
                        driverLastName: myCarpool.driver_last_name,
                        driverLatitude: myCarpool.driver_latitude,
                        driverLongitude: myCarpool.driver_longitude,
                        parentLatitude: myCarpool.driver_latitude,
                        parentLongitude: myCarpool.driver_longitude,
                        parentFirstName: myCarpool.parent_first_name,
                        parentLastName: myCarpool.parent_last_name,
                        parentEmail: myCarpool.parent_email,
                        parentPhoneNumber: myCarpool.parent_phone_number,
                        childFirstName: myCarpool.child_first_name,
                        childLastName: myCarpool.child_last_name,
                        childDropoffTime: myCarpool.child_dropoff_time,
                        childPickupTime: myCarpool.child_pickup_time
                    }
                    setCarpoolData([testCarpool]);

                    // Map vehicle-related fields
                    const vehicleInfo: VehicleData = {
                        driverId: myCarpool.driver_id,
                        vehicleId: myCarpool.vehicle_id,
                        licensePlate: myCarpool.license_plate,
                        seatCapacity: myCarpool.seat_capacity,
                        seatsAvailable: myCarpool.seats_available,
                        driverStartTime: myCarpool.driver_start_time,
                        driverEndTime: myCarpool.driver_end_time,
                        daysAvailable: myCarpool.days_available,
                    };
                    setVehicleData(vehicleInfo);

                    // Set just the status
                    setCarpoolStatus(myCarpool.active_status);

                }
                // setCarpoolData(retrievedCarpools);
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
        
        async function fetchAbsenceData(token:string, userName:string, userId:string) {
            try {
                const response = await axios.get(`${apiUrl}/absences/driver/${userId}`, {
                    headers: {
                        Authorization: "Bearer " + token,
                        user_name: userName,
                        user_id: userId,
                    },
                    
                });
                
                const retrievedAbsences: Absence[] = response.data.map((absence: any) => ({
                    absenceId: absence.absence_id,
                    absenteeId: userId,
                    absenceStartDate: new Date(absence.absence_start_date),
                    absenceEndDate: new Date(absence.absence_end_date),
                }));
                setAbsenceData(retrievedAbsences)
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    const errorKey = error.response.data.error as CarpoolServerErrors;
                    let errorMessage: string = "TODO" + errorKey;
                    setErrorMessage(errorMessage);
                    console.error(error);
                }
            }
        }

        fetchCarpoolData(token!, user!.username, user!.userId);
        fetchAbsenceData(token!, user!.username, user!.userId);

        // Set the initial display user list to the full user list except for the current user
        setIsLoading(false);
    }, [token, user, isLoggedIn, logout, navigate, isAdmin, typeOfDriver, approvedDriverId, apiUrl, translations.children_server_errors]);

    async function updateCarpoolStatus(token:string, userName:string, userId:string, driverId:string, statusId:number) {
        try {
            await axios.put(`${apiUrl}/carpool/${driverId}`, {activeStatus: statusId}, {
                headers: {
                    Authorization: "Bearer " + token,
                    user_name: userName,
                    user_id: userId,
                },
                
            });
            
            setCarpoolStatus(statusId);
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
    
    function handleAbsenceCreation(newSpan:DateRange ) {
        if(!!token || !!user || !!vehicleData){
            const absenceInput = {
                driverId: vehicleData!.driverId,
                absenceStartDate: newSpan.from!,
                absenceEndDate: newSpan.to!
            }
            submitDriverAbsence(token!, user!.username, user!.userId, vehicleData!.driverId, absenceInput);
        }
    }

    function handleAbsenceUpdate( absenceId:number, newSpan:DateRange ) {
        if(!!token || !!user || !!vehicleData){
            const absenceInput = {
                absenceId: absenceId,
                driverId: vehicleData!.driverId,
                absenceStartDate: newSpan.from!,
                absenceEndDate: newSpan.to!
            }
            updateDriverAbsence(token!, user!.username, user!.userId, String(absenceId), absenceInput);
        }
    }

    function handleAbsenceDeletion( absenceId:number) {
        if(!!token || !!user){
            deleteDriverAbsence(token!, user!.username, user!.userId, absenceId);
        }
    }

    async function submitDriverAbsence(token:string, userName:string, userId:string, driverId:string, absenceInput:{driverId:string, absenceStartDate:Date, absenceEndDate:Date}) {
        try {
            const response = await axios.post(`${apiUrl}/absences/driver/${driverId}`, absenceInput, {
                headers: {
                    Authorization: "Bearer " + token,
                    user_name: userName,
                    user_id: userId,
                },
            });
            const createdAbsence: Absence = {
                absenceId: response.data.createdAbsence.absence_id,
                absenteeId: response.data.createdAbsence.driver_id,
                absenceStartDate: new Date( response.data.createdAbsence.absence_start_date),
                absenceEndDate: new Date( response.data.createdAbsence.absence_end_date)
            }
            // Add the new absence to the current list
            // ...existing code...
            const updatedAbsences: Absence[] = [...absenceData, createdAbsence];
            setAbsenceData(updatedAbsences);
// ...existing code...
            setErrorMessage("");

        }catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorKey = error.response.data.error as CarpoolServerErrors;
                let errorMessage: string = "TODO" + errorKey;
                setErrorMessage(errorMessage);
                console.error(error);
            }
        }
    }

    
    async function updateDriverAbsence(token:string, userName:string, userId:string, absenceId:string,  absenceInput:{driverId:string, absenceStartDate:Date, absenceEndDate:Date}) {
        try {
            const response = await axios.put(`${apiUrl}/absences/driver/${absenceId}`, absenceInput, {
                headers: {
                    Authorization: "Bearer " + token,
                    user_name: userName,
                    user_id: userId,
                },
                
            });
            const updatedAbsence: Absence = {
                absenceId: response.data.absenceId,
                absenteeId: response.data.driverId,
                absenceStartDate: new Date( response.data.absenceStartDate),
                absenceEndDate: new Date( response.data.absenceEndDate)
            }
            // Update the absence in the current list
            const updatedAbsences: Absence[] = absenceData.map((absence) =>
                absence.absenceId === updatedAbsence.absenceId ? updatedAbsence : absence
            );
            setAbsenceData(updatedAbsences);
            
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
    
    async function deleteDriverAbsence(token:string, userName:string, userId:string,  absenceId:number) {
        try {
            await axios.delete(`${apiUrl}/absences/driver/${absenceId}`, {
                headers: {
                    Authorization: "Bearer " + token,
                    user_name: userName,
                    user_id: userId,
                },
                
            });
            
            const updatedAbsences: Absence[] = absenceData.filter((absence) => absence.absenceId !== absenceId);
            setAbsenceData(updatedAbsences);
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
        

    function handleCarpoolStatus(newStatus: number) {
        if(!!token || !!user){
            updateCarpoolStatus(token!, user!.username, user!.userId, vehicleData!.driverId, newStatus);
        }
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
                <HelpTip content={translations.help.carpool_management} altText={translations.universal.help_icon}/>
            </div>
            <h1 className="text-3xl font-bold mb-4">{translations.carpool.management_header}</h1>
            
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-300 mb-6 w-full max-w-2xl">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        className={`py-2 px-4 -mb-px font-semibold border-b-2 transition-colors duration-200
                            ${viewState === tab.key
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-blue-600"}
                        `}
                        onClick={() => setViewState(tab.key as typeof viewState)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {viewState === 'my_carpool' && (
                <div>
                    <h2 className="text-2xl font-semibold mb-2">{translations.carpool.my_carpool_tab}</h2>
                    {/* My Carpool Component */}
                    <CarpoolVehicleInfo 
                        vehicleId={vehicleData?.vehicleId || ""}
                        licensePlate={vehicleData?.licensePlate || ""}
                        seatCapacity={vehicleData?.seatCapacity || 0}
                        seatsAvailable={vehicleData?.seatsAvailable || 0}
                        driverStartTime={vehicleData?.driverStartTime || ""}
                        driverEndTime={vehicleData?.driverEndTime || ""}
                        daysAvailable={vehicleData?.daysAvailable || null}
                        carpoolStatus={carpoolStatus}
                        onStatusChange={handleCarpoolStatus}
                />


                </div>
            )}
             {viewState === 'my_absences' && (
                <div>
                    <h2 className="text-2xl font-semibold mb-2">{translations.carpool.my_absences_tab}</h2>
                    {/* My Absences Component */}
                    <DriverAbsences
                        absenceData={absenceData}
                        onAdd={handleAbsenceCreation}
                        onEdit={handleAbsenceUpdate}
                        onDelete={handleAbsenceDeletion}
                    />
                </div>
            )}
            {viewState === 'my_passengers' && (
                <div>
                    <h2 className="text-2xl font-semibold mb-2">{translations.carpool.my_passengers_tab}</h2>
                    {/* My Passengers Component */}
                    {false && <div> {carpoolData.length}  passengers found. </div>}
                    {/* TODO */}
                </div>
            )}
            {viewState === 'carpool_applications' && (
                <div>
                    <h2 className="text-2xl font-semibold mb-2">{translations.carpool.carpool_applications_tab}</h2>
                    {/* Carpool Applications Component */}
                    {/* Steve's Part Here */}
                </div>
            )}
            
            {errorMessage && 
                <div className="mt-4 p-4 border border-red-400 bg-red-100 text-red-700 rounded">
                    {errorMessage}
                </div>
            }
        </div>
    );
}