import React, { useEffect } from 'react'
import enTranslations from "../languages/en.json";
import neTranslations from "../languages/ne.json";
import { useLanguage } from "../context/LanguageContext";
import { CarpoolListData } from '../schema/types';
import { useNavigate } from "react-router-dom";
import DriverRow from './DriverRow';

type DriverTableProps = {
    driverList: CarpoolListData[];
};

const DriverTable: React.FC<DriverTableProps> = ({ driverList }) => {
    
    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;
    const navigate = useNavigate();

    // Function to handle user row click and navigate to an administrative user profile
    const handleUserClick = (userId: string) => {
        navigate(`/user/${userId}`);
    };

    useEffect(() => {
        // Reset the scroll position to the top when the user list changes or language changes
        window.scrollTo(0, 0);
    }, [driverList, translations]);

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            {driverList.length > 0 ? (
                <div className="flex flex-col justify-center items-center overflow-x-auto w-full min-w-full rounded shadow border border-black dark:border-white">
                    <div className="flex flex-row w-full max-w-6xl mx-auto p-2 pt-0 min-w-[600px] border-b border-black dark:border-white">
                        <div className="w-[14%] px-4 py-2 ">
                            <p className="text-center font-bold">{translations.users.username}</p>
                        </div>
                        <div  className="w-[30%] px-4 py-2 ">
                            <p className="text-center font-bold">{translations.users.email}</p>
                        </div>
                        <div  className="w-[20%] px-4 py-2 ">
                            <p className="text-center font-bold">{translations.users.name}</p>
                        </div>
                        <div  className="w-[12%] px-4 py-2 ">
                            <p className="text-center font-bold">{translations.users.contact_number}</p>
                        </div>
                        <div  className="w-[12%] px-4 py-2 ">
                            <p className="text-center font-bold">{translations.users.parent_status}</p>
                        </div>
                        <div  className="w-[12%] px-4 py-2 ">
                            <p className="text-center font-bold">{translations.users.driver_status}</p>
                        </div>
                    </div>
                    <div className="w-full max-w-6xl mx-auto p-2 pt-0 min-w-[600px]">
                        {driverList.map((driver: CarpoolListData) => (
                            <DriverRow
                                key={driver.userId}
                                carpool={driver}
                                onClick={() => handleUserClick(driver.userId)}
                                translations={translations}
                                
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center mt-4">{translations.users.no_users}</div>
            )}
        </div>
    )
}

export default DriverTable