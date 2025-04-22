import React, { use } from "react";
import enTranslations from "../languages/en.json";
import neTranslations from "../languages/ne.json";
import { useLanguage } from "../context/LanguageContext";
//import { useEffect, useState } from "react";

type ChildCardProps = {
    firstName: string;
    lastName: string;
    childId: string;
    pickupTime: string;
    dropoffTime: string;
    onEdit: (childId: string) => void;
    onDelete: (childId: string) => void;
};

const ChildCard: React.FC<ChildCardProps> = ({
    firstName,
    lastName,
    childId,
    pickupTime,
    dropoffTime,
    onEdit,
    onDelete,
}) => {

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    // useEffect(() => {
    //     // This effect runs when the component mounts or when the language changes
    //     // You can add any side effects here if needed
    // }, [language]);

    return (
        <div className="border rounded-lg shadow-md p-4 mb-4 bg-white">
            <h2 className="text-lg font-bold mb-2">
                {firstName} {lastName}
            </h2>
            <p className="text-sm text-gray-600">
                <strong>{translations.children.school_arrival_time_label}</strong> {dropoffTime}
            </p>
            <p className="text-sm text-gray-600">
                <strong>{translations.children.school_departure_time_label}</strong> {pickupTime}
            </p>
            <div className="mt-4 flex space-x-4">
                <button
                    onClick={() => onDelete(childId)}
                    className="bg-[#F4D03F] hover:bg-[#FFFFFF] text-black px-4 py-2 rounded border-transparent hover:border-black border-2"
                >
                    {translations.children.delete_child_button}
                </button>
                <button
                    onClick={() => onEdit(childId)}
                   className="bg-[#3498DB] hover:bg-[#2C3E50] text-white px-4 py-2 rounded"
                >
                    {translations.children.edit_child_button}
                </button>  
            </div>
        </div>
    );
};

export default ChildCard;