import React from 'react';

interface DaysCheckBoxesProps {
    mondayLabel: string;
    tuesdayLabel: string;
    wednesdayLabel: string;
    thursdayLabel: string;
    fridayLabel: string;
    saturdayLabel: string;
    sundayLabel: string;
    daysSelected: string | null;
    onEdit: (value: string) => void;
}

const DaysCheckBoxes: React.FC<DaysCheckBoxesProps> = ({ 
    mondayLabel, tuesdayLabel, wednesdayLabel, thursdayLabel, fridayLabel, saturdayLabel, sundayLabel, daysSelected, onEdit
 }) => {

    // Convert daysSelected string to an array for easier manipulation
    const selectedDays = daysSelected ? daysSelected.split(",") : [];


    const handleCheckboxChange = (day: string, isChecked: boolean) => {
        let updatedDays = [...selectedDays];

        if (isChecked) {
            // Add the day if checked
            updatedDays.push(day);
        } else {
            // Remove the day if unchecked
            updatedDays = updatedDays.filter((selectedDay) => selectedDay !== day);
        }

        // Convert the updatedDays array back to a comma-separated string
        const updateDaysSelected = updatedDays.join(",");

        // Pass the updated days string to the parent
        onEdit(updateDaysSelected);
    };

    return(
        <div className="flex flex-col mt-2">
            <div className="flex flex-col sm:flex-row sm:gap-2">
                <div className="flex flex-row mb-2 sm:w-[50%]">
                    <input
                        type="checkbox"
                        id="mondayInput"
                        checked={selectedDays.includes("Monday")}
                        onChange={(e) => handleCheckboxChange("Monday", e.target.checked)}
                    />
                    <label htmlFor="mondayInput" className="ml-1">
                        {mondayLabel}
                    </label>
                </div>
                <div className="flex flex-row mb-2 sm:w-[50%]">
                    <input
                        type="checkbox"
                        id="tuesdayInput"
                        checked={selectedDays.includes("Tuesday")}
                        onChange={(e) => handleCheckboxChange("Tuesday", e.target.checked)}
                    />
                    <label htmlFor="tuesdayInput" className="ml-1">
                        {tuesdayLabel}
                    </label>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
                <div className="flex flex-row mb-2 sm:w-[50%]">
                    <input
                        type="checkbox"
                        id="wednesdayInput"
                        checked={selectedDays.includes("Wednesday")}
                        onChange={(e) => handleCheckboxChange("Wednesday", e.target.checked)}
                    />
                    <label htmlFor="wednesdayInput" className="ml-1">
                        {wednesdayLabel}
                    </label>
                </div>
                <div className="flex flex-row mb-2 sm:w-[50%]">
                    <input
                        type="checkbox"
                        id="thursdayInput"
                        checked={selectedDays.includes("Thursday")}
                        onChange={(e) => handleCheckboxChange("Thursday", e.target.checked)}
                    />
                    <label htmlFor="thursdayInput" className="ml-1">
                        {thursdayLabel}
                    </label>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
                <div className="flex flex-row mb-2 sm:w-[50%]">
                    <input
                        type="checkbox"
                        id="fridayInput"
                        checked={selectedDays.includes("Friday")}
                        onChange={(e) => handleCheckboxChange("Friday", e.target.checked)}
                    />
                    <label htmlFor="fridayInput" className="ml-1">
                        {fridayLabel}
                    </label>
                </div>
                <div className="flex flex-row mb-2 sm:w-[50%]">
                    <input
                        type="checkbox"
                        id="saturdayInput"
                        checked={selectedDays.includes("Saturday")}
                        onChange={(e) => handleCheckboxChange("Saturday", e.target.checked)}
                    />
                    <label htmlFor="saturdayInput" className="ml-1">
                        {saturdayLabel}
                    </label>
                </div>
            </div>
            <div className="flex flex-row mb-2 sm:w-[50%]">
                <input
                    type="checkbox"
                    id="sundayInput"
                    checked={selectedDays.includes("Sunday")}
                    onChange={(e) => handleCheckboxChange("Sunday", e.target.checked)}
                />
                <label htmlFor="sundayInput" className="ml-1">
                    {sundayLabel}
                </label>
            </div>
        </div>
    );
};

export default DaysCheckBoxes;