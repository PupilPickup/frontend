interface ProfileInputProps {
    label: string,
    elementId: string,
    changeHandler: (input: any) => void,
    value: string | number,
    error: string,
    isNumber?: boolean,
    isPhone?: boolean,
    isPassword?: boolean,
    placeholder?: string
}

const ProfileInput: React.FC<ProfileInputProps> = ( { label, elementId, changeHandler, value, error, isNumber, isPhone, isPassword, placeholder } ) => {

    return (
        <div className="mb-4">
            <label htmlFor={elementId} className="label">{label}</label>
            <input
                type={isNumber!! ? "number" : (isPhone!! ? "phone" : (isPassword!! ? "password" : "text"))}
                name={elementId}
                id={elementId}
                value={value}
                onChange={(e) => changeHandler(e)}  
                className="input"
                placeholder={placeholder}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default ProfileInput;