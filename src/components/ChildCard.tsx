import React from "react";
import enTranslations from "../languages/en.json";
import neTranslations from "../languages/ne.json";
import { useLanguage } from "../context/LanguageContext";
import Button from "./common/Button";
import CardLabel from "./common/CardLabel";

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

    return (
        <div className="border rounded-lg shadow-md p-4 mb-4 bg-white">
            <h2 className="text-lg font-bold mb-2">
                {firstName} {lastName}
            </h2>
            <CardLabel 
                label={translations.children.school_arrival_time_label} data={dropoffTime} 
            />
            <CardLabel 
                label={translations.children.school_departure_time_label} data={pickupTime} 
            />
            <div className="mt-4 flex space-x-4">
                <Button
                    onClick={() => onDelete(childId)}
                    variant="secondary"
                    label={translations.children.delete_child_button}
                />
                <Button
                    onClick={() => onEdit(childId)}
                    variant="primary"
                    label={translations.children.edit_child_button}
                />  
            </div>
        </div>
    );
};

export default ChildCard;