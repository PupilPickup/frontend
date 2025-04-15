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
        let updateDaysSelected = "";
        if(updateDaysSelected.length === 0){
            // don't change
        }else if(updateDaysSelected.length === 1){
            updateDaysSelected = updatedDays[0];
        }else{
            for(let i: number = 0; i < updatedDays.length; i++){
                if(i === 0){
                    updateDaysSelected += updatedDays[i];
                }else{
                    updateDaysSelected += "," + updatedDays[i];
                }
            }
        }
        
        onEdit(updateDaysSelected); // Pass the updated days string to the parent
    };

    return(
<div className="flex flex-col space-y-2">
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedDays.includes("Monday")}
                        onChange={(e) => handleCheckboxChange("Monday", e.target.checked)}
                    />
                    {mondayLabel}
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedDays.includes("Tuesday")}
                        onChange={(e) => handleCheckboxChange("Tuesday", e.target.checked)}
                    />
                    {tuesdayLabel}
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedDays.includes("Wednesday")}
                        onChange={(e) => handleCheckboxChange("Wednesday", e.target.checked)}
                    />
                    {wednesdayLabel}
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedDays.includes("Thursday")}
                        onChange={(e) => handleCheckboxChange("Thursday", e.target.checked)}
                    />
                    {thursdayLabel}
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedDays.includes("Friday")}
                        onChange={(e) => handleCheckboxChange("Friday", e.target.checked)}
                    />
                    {fridayLabel}
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedDays.includes("Saturday")}
                        onChange={(e) => handleCheckboxChange("Saturday", e.target.checked)}
                    />
                    {saturdayLabel}
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedDays.includes("Sunday")}
                        onChange={(e) => handleCheckboxChange("Sunday", e.target.checked)}
                    />
                    {sundayLabel}
                </label>
            </div>
        </div>
    );
};

export default DaysCheckBoxes;