import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CardLabel from "../../components/common/CardLabel";
import HelpTip from "../../components/common/HelpTip";
import { useUser } from "../../context/UserContext";

// Define the possible error keys
type DashboardServerErrors = "username_unknown" | "school_unknown" | "server_error_get" | "generic_error";


export default function Dashboard () {
	const [isLoading, setIsLoading] = useState(true);
	const [serverError, setServerError] = useState<string>("");
	const [carpoolData, setCarpoolData] = useState({
        schoolName: "",
    	contactNumber: "",
    	streetAddress: "",
    	wardNumber: "",
    	municipalityDistrict: "",
    	carpoolDropoffStartTime: "",
    	carpoolPickupStartTime: "",
    	carpoolDropoffEndTime: "",
    	carpoolPickupEndTime: "",
    	carpoolDropoffLocation: "",
    	carpoolPickupLocation: ""
    });

	const { user, isLoggedIn, logout } = useUser();

	const { language } = useLanguage();
	const translations = language === 'ne' ? neTranslations : enTranslations;

	const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

	const navigate = useNavigate();
	const token = sessionStorage.getItem("token");
	
	useEffect(() => {
		if(!token || !isLoggedIn || user === null || user === undefined){
			sessionStorage.removeItem("token");
			logout();
			navigate("/");
			return;
		}

		async function populateSchoolCarpoolData(token:string, userName:string, userId:string) {
			try {
				const response = await axios.get(`${apiUrl}/school/1`, {
					headers: {
						Authorization: "Bearer " + token,
						user_name: userName,
						user_id: userId,
					},
				});
				const schoolDetails = response.data;
				setCarpoolData({
					schoolName: schoolDetails.school_name,
					contactNumber: schoolDetails.contact_number,
					streetAddress: schoolDetails.street_address,
					wardNumber: schoolDetails.ward_number,
					municipalityDistrict: schoolDetails.municipality_district,
					carpoolDropoffStartTime: schoolDetails.carpool_dropoff_start_time,
					carpoolPickupStartTime: schoolDetails.carpool_pickup_start_time,
					carpoolDropoffEndTime: schoolDetails.carpool_dropoff_end_time,
					carpoolPickupEndTime: schoolDetails.carpool_pickup_end_time,
					carpoolDropoffLocation: schoolDetails.carpool_dropoff_location,
					carpoolPickupLocation: schoolDetails.carpool_pickup_location,
				});
				setServerError("");
				setIsLoading(false);

			} catch (error) {
				console.error(error);
				if (axios.isAxiosError(error) && error.response) {
					const errorKey = error.response.data.error as DashboardServerErrors;
					let errorMessage: string = translations.dashboard[errorKey] ?? translations.dashboard.generic_error;
					if(errorMessage.includes("$username}")){
						errorMessage = errorMessage.replace("$username}", userName);
					}
					setServerError(errorMessage);
				}
				setIsLoading(false);
			}
		}

		populateSchoolCarpoolData(token, user!.username, user!.userId);
	}, [navigate, token, user, apiUrl, translations.dashboard]);


	function prettyAddress(streetAddress: string, municipalityDistrict: string, wardLabel: string, wardNumber: string): string {
		let address = streetAddress + ", " + wardLabel + " " + wardNumber + ", " + municipalityDistrict;
		return address.trim();
	}

	if(isLoading){
		return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.loading}</div>
	}

	if(!token){
		return <div className="flex justify-center items-center min-h-[90vh]">{translations.universal.redirecting}</div>
	}

	return (
		<div className="flex flex-col items-center min-h-[90vh] text-base sm:text-lg text-black">
			<div className="flex justify-start w-full mt-2 ml-2 p-1 sm:ml-4 sm:p-2 sm:mt-4">
                <HelpTip content={translations.help.dashboard} altText={translations.universal.help_icon}/>
            </div>
			<h1 className="text-3xl my-4 p-4">{translations.dashboard.welcome_message}</h1>
			{serverError ? 
			(
            	<span className="text-red-500 text-sm mt-1">{serverError}</span>
            ):
			(
				<div className="flex flex-col items-center w-[90%] md:w-[60%] lg:w-[40%] xl:w-[30%] bg-white shadow-md rounded-lg p-6">
					<h3>{carpoolData.schoolName}</h3>
					<div className="flex flex-col items-start w-full mb-2">
						<CardLabel label={translations.dashboard.school_address} data={prettyAddress(carpoolData.streetAddress, carpoolData.municipalityDistrict, translations.dashboard.ward_number, carpoolData.wardNumber )} className={"py -0 my-0"} />
						<CardLabel label={translations.dashboard.school_number} data={carpoolData.contactNumber} className={"py-0 my-0"} />
					</div>
					<h3>{translations.dashboard.carpool_dropoff}</h3>
					<div className="flex flex-col items-start w-full mb-2">
						<CardLabel label={translations.dashboard.location} data={carpoolData.carpoolDropoffLocation} className={"py-0 my-0"} />
						<CardLabel label={translations.dashboard.start_time} data={carpoolData.carpoolDropoffStartTime} className={"py-0 my-0"} />
						<CardLabel label={translations.dashboard.end_time} data={carpoolData.carpoolDropoffEndTime} className={"py-0 my-0"} />
						
					</div>
					<h3>{translations.dashboard.carpool_pickup}</h3>
					<div className="flex flex-col items-start w-full mb-2">
						<CardLabel label={translations.dashboard.location} data={carpoolData.carpoolPickupLocation} className={"py-0 my-0"} />
						<CardLabel label={translations.dashboard.start_time} data={carpoolData.carpoolPickupStartTime} className={"py-0 my-0"} />
						<CardLabel label={translations.dashboard.end_time} data={carpoolData.carpoolPickupEndTime} className={"py-0 my-0"} />
						
					</div>
				</div>
			)}
		</div>
	);
}

// Once able to connect to database, replace user to it's dynamic value.