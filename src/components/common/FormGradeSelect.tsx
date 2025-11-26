interface FormGradeSelectProps {
    label: string,
    elementId: string,
    changeHandler: (input: string) => void,
    value: string,
    error: string
}

const FormGradeSelect: React.FC<FormGradeSelectProps> = ({
    label, 
    elementId, 
    changeHandler, 
    value, 
    error
    
}) => {
    console.log('FormGradeSelect value:', value);

const gradeOptions = [
  { value: "", label: "Select Grade" },
  { value: "prek", label: "Pre-K" },
  { value: "k", label: "Kindergarten" },
  { value: "1", label: "1st Grade" },
  { value: "2", label: "2nd Grade" },
  { value: "3", label: "3rd Grade" },
  { value: "4", label: "4th Grade" },
  { value: "5", label: "5th Grade" },
  { value: "6", label: "6th Grade" },
  { value: "7", label: "7th Grade" },
  { value: "8", label: "8th Grade" },
  { value: "9", label: "9th Grade" },
  { value: "10", label: "10th Grade" },
  { value: "11", label: "11th Grade" },
  { value: "12", label: "12th Grade" }
];

    return (
        <div className="mb-4 flex flex-col w-full">
            <div className="flex flex-col sm:flex-row w-full gap-2 sm:items-center">
                <label htmlFor={elementId} className="text-sm sm:text-base text-black dark:text-white space-x-2 sm:space-x-1 sm:w-[25%]">{label}</label>
                <select
                    name={elementId}
                    id={elementId}
                    value={value}
                    onChange={(e) => {
                        console.log('Grade selected:', e.target.value);
                        changeHandler(e.target.value)
                    }}  
                    className="border rounded-lg shadow-md p-2 sm:w-[72%] bg-white text-black dark:bg-[#3498DB] dark:text-white"
                >
                    {gradeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                        {option.label}
                        </option>
                    ))}
                </select>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default FormGradeSelect;