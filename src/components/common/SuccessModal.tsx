import Button from "./Button";

interface SuccessModalProps {
    message: string;
    buttonLabel: string;
    onAction: () => void;
    className?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ( { message, buttonLabel, onAction, className } ) => {

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${className}`}>
            <div className="bg-white dark:bg-[#3498DB] text-black dark:text-white dark:text-black p-6 rounded-lg shadow-lg w-full max-w-md">
              <p className="text-base mb-4">{message}</p>
                <div className="flex flex-row justify-center" >
                  <Button
                    label={buttonLabel}
                    variant="primary"
                    className="w-[50%] dark:bg-[#2C3E50]"
                    type="button"
                    onClick={onAction}
                    
                  />
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;