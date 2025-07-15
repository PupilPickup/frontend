interface FormNumberInputProps {
    label: string,
    elementId: string,
    changeHandler: (input: number) => void,
    value: number,
    error: string
}

const FormNumberInput: React.FC<FormNumberInputProps> = ( { label, elementId, changeHandler, value, error } ) => {

    return (
        <div className="mb-4 flex flex-col w-full">
            <div className="flex flex-col sm:flex-row w-full gap-2 sm:items-center">
                <label htmlFor={elementId} className="text-sm sm:text-base bg-white text-black dark:bg-[#3498DB] dark:text-white space-x-2 sm:space-x-1 sm:w-[25%]">{label}</label>
                <input
                    type="number"
                    name={elementId}
                    id={elementId}
                    value={value}
                    onChange={(e) => changeHandler((Number)(e.target.value))}  
                    className="border rounded-lg shadow-md p-2 sm:w-[72%] bg-white text-black dark:bg-[#3498DB] dark:text-white"
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default FormNumberInput;