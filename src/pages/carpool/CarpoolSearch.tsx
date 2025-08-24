import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import HelpTip from "../../components/common/HelpTip";
import { useUser } from "../../context/UserContext";
import { DriverServerErrors } from "../../schema/serverErrorTypes";
import { CarpoolListData } from "../../schema/types";
import DriverTable from "../../components/DriverTable";

export default function UserManagement () {

    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const pendingParentId: number = Number(process.env.ROLE_PENDING_PARENT_ID) || 4;
    const rejectedParentId: number = Number(process.env.ROLE_REJECTED_PARENT_ID) || 7;
    const noRoleId: number = Number(process.env.ROLE_ROLELESS_USER_ID) || 6;

    const [isLoading, setIsLoading] = useState(true);
    const [serverError, setServerError] = useState<string>("");
    const [driverList, setDriverList] = useState<CarpoolListData[]>([]);
    const [displayDriverList, setDisplayDriverList] = useState<CarpoolListData[]>([]);
    // const [hideUnavailableDrivers, setHideUnavailableDrivers] = useState<boolean>(false);
    const [hideNoCapacityDrivers, setHideNoCapacityDrivers] = useState<boolean>(false);
    const [userParentType, setUserParentType] = useState<number>(noRoleId);

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;
    const navigate = useNavigate();
    const token: string | null = sessionStorage.getItem("token");


    const { user, logout, isLoggedIn, typeOfParent } = useUser();

    useEffect(() => {
        if(!token || !isLoggedIn || user === null || user === undefined){
            sessionStorage.removeItem("token");
            logout();
            navigate("/");
            return;
        }

        let parentType = typeOfParent();

        async function populateDriverList(token:string, userName:string, userId:string, latitude: number, longitude: number) {
            try {
                const response = await axios.get(`${apiUrl}/carpool/list`, { 
                    headers: {
                        Authorization: "Bearer " + token,
                        user_name: userName,
                        user_id: userId,
                    },
                });
                const retrievedDrivers: CarpoolListData[] = response.data.drivers;
                
                // Sort drivers by distance
                retrievedDrivers.sort((a: CarpoolListData, b: CarpoolListData) => {
                    const distanceA = distance(a.latitude, a.longitude, latitude, longitude);
                    const distanceB = distance(b.latitude, b.longitude, latitude, longitude);
                    return distanceA - distanceB;
                });
                
                setDriverList(retrievedDrivers);
                setDisplayDriverList(retrievedDrivers);
                setIsLoading(false);
                setServerError("");

            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    const errorKey = error.response.data.error as DriverServerErrors;
                    let errorMessage: string = "TODO" + errorKey;
                    setServerError(errorMessage);
                    console.error(error);
                }
                setIsLoading(false);
            }
        }

        if(!(parentType === noRoleId || parentType === rejectedParentId || parentType === pendingParentId)){
            populateDriverList(token!, user!.username, user!.userId, user!.latitude, user!.longitude);
        }
        setUserParentType(parentType);
        setIsLoading(false);
    }, [token, user, isLoggedIn, logout, navigate, typeOfParent, apiUrl, translations.children_server_errors]);

    useEffect(() => {
        setDisplayDriverList(driverList);
    }, [driverList]);

    // Function to calculate distance between two coordinates using Haversine formula
    function distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const toRad = (value: number) => (value * Math.PI) / 180;
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    }


    // Function to filter out drivers with no capacity
    function filterNoCapacityDrivers(event: React.ChangeEvent<HTMLInputElement>) {
        const isChecked = event.target.checked;
        if (isChecked) {
            const filteredDrivers = driverList.filter(carpool => carpool.seatsAvailable > 0);
            setDisplayDriverList(filteredDrivers);
            setHideNoCapacityDrivers(true);
        } else {
            setDisplayDriverList(driverList);
            setHideNoCapacityDrivers(false);
        }
        
    }

    if(isLoading){
        return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.loading}</div>
    }

    if(!token){
        return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.redirecting}</div>
    }

    if(userParentType === noRoleId || userParentType === rejectedParentId || userParentType === pendingParentId){
        return (
            <div className="flex flex-col items-center min-h-[90vh] w-full my-4 px-4">
                <div className="flex justify-start w-full">
                    <HelpTip content={translations.help.carpool_search} altText={translations.universal.help_icon}/>
                </div>
                <h1 className="text-3xl font-bold mb-4">{translations.carpool.carpool_header}</h1>
                <h2>{translations.carpool.no_access}</h2>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-[90vh] w-full my-4 px-4">
            <div className="flex justify-start w-full">
                <HelpTip content={translations.help.user_search} altText={translations.universal.help_icon}/>
            </div>
            <h1 className="text-3xl font-bold mb-4">{translations.carpool.carpool_header}</h1>
            <h2>{translations.carpool.carpool_prompt}</h2>
            {serverError && <div className="text-red-500 mb-4">{serverError}</div>}
            <div className="flex flex-row my-2 items-center">
                <div className="flex flex-row mb-2 px-1">
                    <input
                        type="checkbox"
                        id="noCapacityInput"
                        checked={hideNoCapacityDrivers}
                        onChange={filterNoCapacityDrivers}
                    />
                    <label htmlFor="noCapacityInput" className="ml-1">
                        {translations.carpool.hide_no_capacity_drivers}
                    </label>
                </div>
            </div>
            <DriverTable driverList={displayDriverList} userLatitude={user!.latitude} userLongitude={user!.longitude} />
        </div>
    );
}