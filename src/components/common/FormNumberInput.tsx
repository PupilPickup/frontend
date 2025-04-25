interface FormNumberInputProps {
    label: string,
    elementId: string,
    changeHandler: (input: number) => void,
    value: number,
    error: string
}

const FormNumberInput: React.FC<FormNumberInputProps> = ( { label, elementId, changeHandler, value, error } ) => {

    return (
        <div className="mb-4">
            <label htmlFor={elementId} className="text-sm text-gray-600">{label}</label>
            <input
                type="number"
                name={elementId}
                id={elementId}
                value={value}
                onChange={(e) => changeHandler((Number)(e.target.value))}  
                className="border rounded-lg shadow-md p-2 mb-4 w-full"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};

export default FormNumberInput;