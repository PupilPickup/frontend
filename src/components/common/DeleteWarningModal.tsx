import Button from "../../components/common/Button";

interface DeleteWarningModalProps {
    prompt: string;
    abortLabel: string;
    confirmLabel: string;
    onAbort: () => void;
    onConfirm: () => void;
    className?: string;
}

const DeleteWarningModal: React.FC<DeleteWarningModalProps> = ( { prompt, abortLabel, confirmLabel, onAbort, onConfirm, className } ) => {

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${className}`}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <p className="text-base mb-4">{prompt}</p>
                <div className="flex flex-row justify-between" >
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
                    className="w-[40%]"
                    type="button"
                    onClick={onConfirm}
                  />
                </div>
            </div>
        </div>
    );
};

export default DeleteWarningModal;