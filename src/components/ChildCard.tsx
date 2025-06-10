import { useState } from "react";
import enTranslations from "../languages/en.json";
import neTranslations from "../languages/ne.json";
import { useLanguage } from "../context/LanguageContext";
import Button from "./common/Button";
import CardLabel from "./common/CardLabel";
import DeleteWarningModal from "./common/DeleteWarningModal";

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

    const [showDeleteWarning, setShowDeleteWarning] = useState(false);

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    // Function to confirm the delete action
    function confirmDelete(){
        setShowDeleteWarning(true);
    }

    // Function to handle the delete action
    async function handleDelete() {
        setShowDeleteWarning(false);
        // Call the onDelete function passed as a prop
        onDelete(childId);
    }

    // Function to handle cancelling the delete action
    function cancelDelete() {
        setShowDeleteWarning(false);
    }


    return (
        <div className="border rounded-lg shadow-md p-4 my-4 bg-white w-full max-w-[20rem]">
            <h2 className="text-lg font-bold mb-2 text-center">
                {firstName} {lastName}
            </h2>
            <CardLabel 
                label={translations.children.school_arrival_time_label} data={dropoffTime} 
            />
            <CardLabel 
                label={translations.children.school_departure_time_label} data={pickupTime} 
            />
            <div className="mt-4 px-2 flex flex-row w-full justify-between">
                <Button
                    onClick={confirmDelete}
                    variant="secondary"
                    label={translations.children.delete_child_button}
                />
                <Button
                    onClick={() => onEdit(childId)}
                    variant="primary"
                    label={translations.children.edit_child_button}
                />  
            </div>
            {showDeleteWarning && <DeleteWarningModal prompt={translations.children.delete_confirmation_message} abortLabel={translations.children.cancel_button} confirmLabel={translations.children.delete_child_button} onAbort={cancelDelete} onConfirm={handleDelete} />} 
        </div>
    );
};

export default ChildCard;