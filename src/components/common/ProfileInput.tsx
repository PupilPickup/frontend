interface ProfileInputProps {
    label: string,
    elementId: string,
    changeHandler: (input: any) => void,
    value: string | number,
    error: string,
    isNumber?: boolean,
    isPhone?: boolean,
    isPassword?: boolean,
    isTextarea?: boolean,
    placeholder?: string
}

const ProfileInput: React.FC<ProfileInputProps> = ( { label, elementId, changeHandler, value, error, isNumber, isPhone, isPassword, isTextarea, placeholder } ) => {

    return (
        <div className="mb-4 flex flex-col w-full">
            <div className={`flex  w-full gap-2 sm:items-start ${isTextarea ? "flex-col" : "flex-col sm:flex-row"}`}>
                <label htmlFor={elementId} className={`font-bold text-sm sm:text-base text-black dark:text-white space-x-2 sm:space-x-1 ${isTextarea ? "sm:w-full" : "sm:w-[25%]"}`}>{label}</label>
                {isTextarea ? (
                    <textarea
                        name={elementId}
                        id={elementId}
                        value={value}
                        onChange={(e) => changeHandler(e)}
                        className="border rounded-lg shadow-md p-2 sm:w-[72%] min-h-[100px] text-left"
                        placeholder={placeholder}
                    />
                ) : (
                    <input
                        type={isNumber!! ? "number" : (isPhone!! ? "phone" : (isPassword!! ? "password" : "text"))}
                        name={elementId}
                        id={elementId}
                        value={value}
                        onChange={(e) => changeHandler(e)}  
                        className="border rounded-lg shadow-md p-2 sm:w-[72%] bg-white text-black dark:bg-[#3498DB] dark:text-white"
                        placeholder={placeholder}
                    />
                )}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default ProfileInput;