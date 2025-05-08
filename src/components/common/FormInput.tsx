interface FormInputProps {
    label: string,
    elementId: string,
    changeHandler: (input: string) => void,
    value: string,
    error: string, 
    isPassword?: boolean
}

const FormInput: React.FC<FormInputProps> = ( { label, elementId, changeHandler, value, error, isPassword } ) => {

    return (
        <div className="mb-4 flex flex-col w-full">
            <div className="flex flex-col sm:flex-row w-full gap-2 sm:items-center">
                <label htmlFor={elementId} className="text-sm sm:text-base text-black space-x-2 sm:space-x-1 sm:w-[25%]">{label}</label>
                <input
                    type={isPassword!! ? "password" : "text"}
                    name={elementId}
                    id={elementId}
                    value={value}
                    onChange={(e) => changeHandler(e.target.value)}  
                    className="border rounded-lg shadow-md p-2 sm:w-[72%]"
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default FormInput;