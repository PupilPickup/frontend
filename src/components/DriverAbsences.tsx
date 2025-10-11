import React, { useEffect, useState } from "react";
import CalendarSelection from "./common/CalendarSelection";
import { DateRange } from "react-day-picker";
import { Absence } from "../schema/types";
import Button from "./common/Button";

interface DriverAbsencesProps {    
    absenceData: Absence[];
    onEdit: (absenceId: number, newSpan: DateRange) => void;
    onDelete: (absenceId: number) => void;
    onAdd: (absenceSpan: DateRange) => void;
}

const DriverAbsences: React.FC<DriverAbsencesProps> = ({ absenceData, onEdit, onDelete, onAdd}) => {
  
  const [error, setError] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [stateEdit, setStateEdit] = useState(false);
  const [selectedAbsenceId, setSelectedAbsenceId] = useState<number | null>(null);
  const [selectedAbsenceRange, setSelectedAbsenceRange] = useState<DateRange | undefined>(undefined);

    function handleAddAbsence(absenceSpan: DateRange) {
        
        if(stateEdit){
            handleEditAbsenceConfirm(absenceSpan);
        }else{  
            onAdd(absenceSpan);
            setShowCalendar(false);
        }
    }

    function handleEditAbsenceOpen(absenceId: number, currentSpan: DateRange) {
        setStateEdit(true);
        setSelectedAbsenceId(absenceId);
        setSelectedAbsenceRange(currentSpan);
        setShowCalendar(true);
    }

    function handleEditAbsenceConfirm(absenceSpan: DateRange) {
        if(selectedAbsenceId !== null && !!absenceSpan.from && !!absenceSpan.to){
            onEdit(selectedAbsenceId, absenceSpan);
            setError(null);
            setShowCalendar(false);
            setStateEdit(false);
        }else{
            setError("Please select a valid date range.");//TODO
        }
    }

    function handleAddAbsenceOpen() {
        setSelectedAbsenceId(null);
        setStateEdit(false);
        setSelectedAbsenceRange(undefined);
        setShowCalendar(true);
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{}</h2>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {absenceData.length === 0 ? (
                <p>No absences recorded.</p>
            ) : (

                <ul className="mb-4">
                    {absenceData.map((absence) => (
                        <li key={absence.absenceId} className="mb-2 border-b pb-2">
                            <div>
                                <p className="font-semibold">
                                {absence.absenceStartDate.toLocaleDateString()} -{" "}
                                {absence.absenceEndDate.toLocaleDateString()}
                                </p>
                            </div>
                            <Button
                                label={"Edit"}
                                variant="primary"
                                className="mr-2"
                                onClick={()=>handleEditAbsenceOpen(absence.absenceId, {from: absence.absenceStartDate, to: absence.absenceEndDate})}
                            />
                            <Button
                                label={"Delete"}
                                variant="secondary"
                                className="mr-2"
                                onClick={()=>onDelete(absence.absenceId)}
                            />
                        </li>
                    ))}
                </ul>
            )}
            <Button
                label={"Add Absence"}
                variant="primary"
                onClick={handleAddAbsenceOpen}
            />
            {showCalendar && (
                <CalendarSelection
                    prompt={"Select Absence Dates"}//TODO
                    abortLabel={"Cancel"}//TODO
                    confirmLabel={stateEdit ? "Edit Absence" : "Add Absence"}//TODO
                    onAbort={() => setShowCalendar(false)}
                    onConfirm={handleAddAbsence}
                    className=""
                    givenRange={selectedAbsenceRange}
                />
            )}
        </div>
    );
};

export default DriverAbsences;