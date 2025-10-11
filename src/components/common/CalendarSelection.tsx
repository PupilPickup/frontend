import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import Button from "./Button";

interface CalendarSelectionProps {
    prompt: string;
    abortLabel: string;
    confirmLabel: string;
    onAbort: () => void;
    onConfirm: (absenceDate: DateRange) => void;
    className?: string;
    givenRange?: DateRange;
}

const CalendarSelection: React.FC<CalendarSelectionProps> = ( { prompt, abortLabel, confirmLabel, onAbort, onConfirm, className, givenRange } ) => {

  const [range, setRange] = useState<DateRange | undefined>(givenRange);
  

  function handleConfirm() {
    if (range && range.from && range.to) {
        onConfirm(range);
    }
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${className}`}>
      <div className="flex flex-col bg-white dark:bg-[#3498DB] text-black dark:text-white dark:text-black p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">{prompt}</h2>
        <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            className="border rounded-lg my-2"
        />
        <p className="text-sm text-gray-500 mt-2"
            style={{
                minHeight: "1.5em", // Ensures at least one line of height
                visibility: range?.from && range?.to ? "visible" : "hidden",
            }}
        >
            {range?.from && range?.to
            ? `${range.from.toDateString()} - ${range.to.toDateString()}`
            : ""}
        </p>
        <div className="flex flex-row justify-between my-2" >
                <Button
                    label={abortLabel}
                    variant="secondary"
                    className="w-[40%]"
                    type="button"
                    onClick={onAbort}
                />
                <Button
                    label={confirmLabel}
                    variant="primary"
                    className="w-[40%] dark:bg-[#2C3E50]"
                    type="button"
                    onClick={handleConfirm}
                />
            </div>
        </div>
    </div>
  );
}

export default CalendarSelection;