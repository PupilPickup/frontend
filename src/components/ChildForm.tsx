import React from "react";
import enTranslations from "../languages/en.json";
import neTranslations from "../languages/ne.json";
import { useLanguage } from "../context/LanguageContext";
import { useEffect } from "react";

type ChildFormProps = {
    firstName: string;
    lastName: string;
    pickupTime: string;
    dropoffTime: string;
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
    setPickupTime: (value: string) => void;
    setDropoffTime: (value: string) => void;
    firstNameError: string;
    lastNameError: string;
    pickupTimeError: string;
    dropoffTimeError: string;
};

const ChildForm: React.FC<ChildFormProps> = ({
    firstName,
    lastName,
    pickupTime,
    dropoffTime,
    setFirstName,
    setLastName,
    setPickupTime,
    setDropoffTime,
    firstNameError,
    lastNameError,
    pickupTimeError,
    dropoffTimeError,

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
                <label htmlFor="firstName" className="text-sm text-gray-600">{translations.children.first_name_label}</label>
                <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}  
                    className="border rounded-lg shadow-md p-2 mb-4 w-full"
                />
                {firstNameError && <p className="text-red-500 text-sm">{firstNameError}</p>}
            </div>
            <div>
                <label htmlFor="lastName" className="text-sm text-gray-600">{translations.children.last_name_label}</label>
                <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}  
                    className="border rounded-lg shadow-md p-2 mb-4 w-full"
                />
                {lastNameError && <p className="text-red-500 text-sm">{lastNameError}</p>}
            </div>
            <div>
                <label htmlFor="dropoffTime" className="text-sm text-gray-600">{translations.children.school_arrival_time_label}</label>
                <input
                    type="text"
                    name="dropoffTime"
                    id="dropoffTime"
                    value={dropoffTime}
                    onChange={(e) => setDropoffTime(e.target.value)}  
                    className="border rounded-lg shadow-md p-2 mb-4 w-full"
                />
                {dropoffTimeError && <p className="text-red-500 text-sm">{dropoffTimeError}</p>}
            </div>
            <div>
                <label htmlFor="pickupTime" className="text-sm text-gray-600">{translations.children.school_departure_time_label}</label>
                <input
                    type="text"
                    name="pickupTime"
                    id="pickupTime"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}  
                    className="border rounded-lg shadow-md p-2 mb-4 w-full"
                />
                {pickupTimeError && <p className="text-red-500 text-sm">{pickupTimeError}</p>}
            </div>
        </div>
    );
};

export default ChildForm;