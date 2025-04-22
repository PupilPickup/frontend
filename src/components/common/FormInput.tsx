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
        <div className="mb-4">
            <label htmlFor={elementId} className="text-sm text-gray-600">{label}</label>
            <input
                type={isPassword!! ? "password" : "text"}
                name={elementId}
                id={elementId}
                value={value}
                onChange={(e) => changeHandler(e.target.value)}  
                className="border rounded-lg shadow-md p-2 mb-4 w-full"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};

export default FormInput;