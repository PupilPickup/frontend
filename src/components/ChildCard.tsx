import { useState } from "react";
import enTranslations from "../languages/en.json";
import neTranslations from "../languages/ne.json";
import { useLanguage } from "../context/LanguageContext";
import Button from "./common/Button";
import CardLabel from "./common/CardLabel";
import DeleteWarningModal from "./common/DeleteWarningModal";
import CalandarSelection from "./common/CalandarSelection";
import { DateRange } from "react-day-picker";

type ChildCardProps = {
    firstName: string;
    lastName: string;
    childId: string;
    pickupTime: string;
    dropoffTime: string;
    onEdit: (childId: string) => void;
    onDelete: (childId: string) => void;
    submitAbsence: (childId: string, absenceSpan: DateRange) => void;
};

const ChildCard: React.FC<ChildCardProps> = ({
    firstName,
    lastName,
    childId,
    pickupTime,
    dropoffTime,
    onEdit,
    onDelete,
    submitAbsence
}) => {

    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const [showCalandar, setShowCalandar] = useState(false);

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

    // Function to handle cancelling the delete action
    function handleShowCalendar() {
        setShowCalandar(true); 
    }

    // Function to handle cancelling the delete action
    function handleHideCalendar() {
        setShowCalandar(false); 
    }

    function handleAddAbsence(absenceSpan: DateRange){
        // Logic to add absence
        submitAbsence(childId, absenceSpan);
        setShowCalandar(false);
    }

    return (
        <div className="border rounded-lg shadow-md p-4 my-4 bg-white dark:bg-[#3498DB] text-black dark:text-white w-full max-w-[20rem]">
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
                    className="dark:bg-[#2C3E50]"
                />
                <Button
                    onClick={handleShowCalendar}
                    variant="primary"
                    label={translations.children.record_absence_button}
                    className="dark:bg-[#2C3E50]"
                />
            </div>
            {showCalandar && 
                <CalandarSelection 
                    prompt={translations.children.absence_prompt}
                    abortLabel={translations.children.cancel_button} 
                    confirmLabel={translations.children.record_absence_button}
                    onAbort={handleHideCalendar} 
                    onConfirm={handleAddAbsence}
                />
            }
            {showDeleteWarning && <DeleteWarningModal prompt={translations.children.delete_confirmation_message} abortLabel={translations.children.cancel_button} confirmLabel={translations.children.delete_child_button} onAbort={cancelDelete} onConfirm={handleDelete} />} 
        </div>
    );
};

export default ChildCard;