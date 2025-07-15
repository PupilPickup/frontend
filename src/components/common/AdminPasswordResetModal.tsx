import { useState } from "react";
import Button from "../../components/common/Button";
import ProfileInput from "./ProfileInput";
import { isEmailValid } from "../../utils/profileValidation";


interface AdminPasswordResetModalProps {
    prompt: string;
    emailLabel: string;
    abortLabel: string;
    confirmLabel: string;
    email: string;
    emailError: string;
    onAbort: () => void;
    onConfirm: (email: string) => void;
    className?: string;
}

const AdminPasswordReset: React.FC<AdminPasswordResetModalProps> = ( { prompt, abortLabel, confirmLabel, emailLabel, email, emailError, onAbort, onConfirm, className } ) => {

    const [resetEmail, setResetEmail] = useState<string>(email);
    const [resetEmailError, setResetEmailError] = useState<string>("");

    function handleConfirm(){
      if(!isEmailValid(resetEmail)) {
        setResetEmailError(emailError);
      }else{
        setResetEmailError("");
        onConfirm(resetEmail);
      }
    }

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${className}`}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <p className="text-base mb-4">{prompt}</p>
                <ProfileInput
                  label={emailLabel}
                  elementId="resetEmail"
                  value={resetEmail}
                  changeHandler={(e) => setResetEmail(e.target.value)}
                  error={resetEmailError}
                />
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
                    onClick={handleConfirm}
                  />
                </div>
            </div>
        </div>
    );
};

export default AdminPasswordReset;