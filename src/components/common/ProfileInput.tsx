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
        <div className="mb-4 flex flex-col w-full">
            <div className="flex flex-col sm:flex-row w-full gap-2 sm:items-center">
                <label htmlFor={elementId} className="text-sm sm:text-base text-black space-x-2 sm:space-x-1 sm:w-[25%]">{label}</label>
                <input
                    type={isNumber!! ? "number" : (isPhone!! ? "phone" : (isPassword!! ? "password" : "text"))}
                    name={elementId}
                    id={elementId}
                    value={value}
                    onChange={(e) => changeHandler(e)}  
                    className="border rounded-lg shadow-md p-2 sm:w-[72%]"
                    placeholder={placeholder}
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default ProfileInput;