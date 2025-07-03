import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validatePassword } from "../../schema/loginSchema";
import Button from "../../components/common/Button";
import WeShare from "../../assets/icons/Weshare.svg";
import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import axios from "axios";
import FormInput from "../../components/common/FormInput";
import { isFieldEmpty } from "../../utils/profileValidation";
import { UserData } from "../../schema/types";
import HelpTip from "../../components/common/HelpTip";
import { useUser } from "../../context/UserContext";

// Define the possible error keys
type LoginServerErrors = 'empty_fields' | 'username_not_existent' | 'invalid_credentials' | 'server_error' | 'generic_error';

type ResetPasswordServerErrors = 'empty_fields' | 'username_email_mismatch' | 'user_password_update_fail' | 'email_sent_failed'| 'generic_error';

// interface LoginPageProps {
// 	isLoggedIn: boolean, 
// 	login: (user: UserData | null) => void;
// }

// const LoginPage: React.FC<LoginPageProps> = ( { isLoggedIn, login } ) => {
export default function LoginPage() {

  // Input states
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [forgotUsername, setForgotUsername] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");

  // Error States
  const [usernameEmailError, setUsernameEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [forgotUsernameError, setForgotUsernameError] = useState("");
  const [forgotEmailError, setForgotEmailError] = useState("");
  const [serverError, setServerError] = useState("");

  // Conditional States
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get language and user info
  const navigate = useNavigate();
  const { language } = useLanguage();
  const translations = language === 'ne' ? neTranslations : enTranslations;
  const { login, isLoggedIn } = useUser();
  const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const token: string | null  = sessionStorage.getItem("token")

  useEffect(() => {
    setUsernameEmailError("");
    setPasswordError("");
    setServerError("");
    setForgotEmailError("");
    setForgotUsernameError("");
    setEmailSuccess(false);
  }, [language]);

  useEffect(() => {
		if (!!token || isLoggedIn) {
			navigate("/dashboard");
		}
    setIsLoading(false);
	}, [isLoggedIn, token, navigate]);
  
  function clearFieldsOnLogin(){
    setLoginInput("");
    setPassword("");
    setUsernameEmailError("");
    setPasswordError("");
    setServerError("");
    setEmailSuccess(false);
    setForgotEmail("");
    setForgotEmailError("");
    setForgotUsername("");
    setForgotUsernameError("");
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasError: boolean = false;
    if(loginInput.length === 0){
      hasError = true;
      setUsernameEmailError(translations.login.require_username_email_error);
    }else{
      setUsernameEmailError("");
    }

    if(password.length === 0){
      hasError = true;
      setPasswordError(translations.login.require_password_error);
    }else if (!validatePassword(password)) {
      hasError = true;
      setPasswordError(translations.login.password_error_message);
    }else{
      setPasswordError("");
    }

    setServerError("");

    if(hasError){ 
      return; 
    }

    let username = "";
    let email = "";
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(emailPattern.test(loginInput)){
      email = loginInput;
    }else{
      username = loginInput;
    }

    const loginData = {
      username: username,
      email: email,
      password: password
    }

    try {
      const response = await axios.post(`${apiUrl}/users/login`, loginData);
      const roles: string[] = response.data.roles || [];
      sessionStorage.setItem("token", response.data.token);
      clearFieldsOnLogin();
      const userData: UserData = {
        userId: response.data.user_id,
        username: response.data.user_name,
        email: response.data.email,
        roles: roles
      }
      login(userData);
      // navigate("/dashboard");

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorKey = error.response.data.error as LoginServerErrors;
        let errorMessage: string = translations.login_server_errors[errorKey] || translations.login_server_errors.generic_error;
        if(errorMessage.includes("$username}")){
          errorMessage = errorMessage.replace("$username}", loginInput);
        }

        if(errorMessage.includes("$email}")){
          errorMessage = errorMessage.replace("$email}", loginInput);
        }

        if(!!error.response.data.server_error){
          console.error("Error during login:", error.response.data.server_error);
        }

        setServerError(errorMessage);

      }
    }
  };

  const handleForgotPassword = async () => {
    let hasError: boolean = false;
    if(isFieldEmpty(forgotUsername)){
      setForgotUsernameError(translations.forgot_password.require_username_error);
      hasError = true;
    }else{
      setForgotUsernameError("");
    }
    if(isFieldEmpty(forgotEmail)){
      setForgotEmailError(translations.forgot_password.require_email_error);
      hasError = true;
    }else{
      setForgotEmailError("");
    }
    if(hasError){
      return;
    }else{
      console.log("no errors in input");
      const userData = {
        username: forgotUsername,
        email: forgotEmail,
        subject: translations.forgot_password.email_subject,
        body: translations.forgot_password.email_body
      }
      try{
        await axios.put(`${apiUrl}/users/reset-password`, userData);
        console.log("no errors in sending");
        setForgotEmail("");
        setForgotUsername("");
        setServerError("");
        setEmailSuccess(true);
        
      }catch(error){
        if (axios.isAxiosError(error) && error.response) {
          const errorKey = error.response.data.error as ResetPasswordServerErrors;
          let errorMessage: string = translations.forgot_password_server_error[errorKey] || translations.forgot_password_server_error.generic_error;
          setServerError(errorMessage);
        }
        setEmailSuccess(false);
      }
      setIsModalOpen(false);
    }
  }

  if(isLoading){
		return <div className="flex justify-center items-center min-h-screen">{translations.universal.loading}</div>
	}

	if(isLoggedIn){
		return <div className="flex justify-center items-center min-h-screen">{translations.universal.redirecting}</div>
	}

  return (
    <div className="px-4 pb-4 flex flex-col w-full items-center">
      <div className="flex justify-start w-full">
        <HelpTip content={translations.help.login} altText={translations.universal.help_icon}/>
      </div>
      <div className="w-full sm:max-w-[52rem]">
        <div className="flex justify-center">
          <img src={WeShare} alt={translations.login.alt_logo_text} />
        </div>
        <header className="flex flex-col text-center mb-6">
          <h1 className="text-3xl font-bold">{translations.login.welcome_back_message}</h1>
          <p className="text-sm mx-auto">{translations.login.login_prompt_message}</p>
        </header>

        <form className="flex flex-col space-y-6 mx-6" onSubmit={handleSubmit}>
          <fieldset className="space-y-2">
            <div className="flex flex-col">
              <FormInput
                label={translations.login.username_or_email_label}
                elementId="username"
                changeHandler={setLoginInput}
                value={loginInput}
                error={usernameEmailError}
              />
            </div>
            <div className="flex flex-col">
              <FormInput
                label={translations.login.password_label}
                elementId="password"
                changeHandler={setPassword}
                value={password}
                error={passwordError}
                isPassword={true}
              />
            </div>
            {serverError && (
              <span className="text-red-500 text-sm mt-1">{serverError}</span>
            )}
            {emailSuccess && (
              <span className="text-[#27AE60] text-sm mt-1">{translations.forgot_password.email_sent}</span>
            )}
          </fieldset>

          <Button
            label={translations.login.login_button}
            variant="primary"
            className="w-full p-2 rounded-md"
            type="submit"
          />
        </form>
        <div className="m-6">
          <p
            className="text-base text-[#27AE60] cursor-pointer hover:underline"
            onClick={() => setIsModalOpen(true)}
          >
            {translations.login.forgot_password_text}
          </p>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">{translations.forgot_password.modal_title}</h2>
              <p className="text-sm mb-4">{translations.forgot_password.modal_message}</p>
              <form className="flex flex-col space-y-4">
                <FormInput
                  label={translations.forgot_password.username_label}
                  elementId="forgotPasswordUser"
                  changeHandler={setForgotUsername}
                  value={forgotUsername}
                  error={forgotUsernameError}
                />
                <FormInput
                  label={translations.forgot_password.email_label}
                  elementId="forgotPasswordEmail"
                  changeHandler={setForgotEmail}
                  value={forgotEmail}
                  error={forgotEmailError}
                />
                <div className="flex flex-row justify-between" >
                  <Button
                    label={translations.forgot_password.cancel_button}
                    variant="secondary"
                    className="w-[40%]"
                    type="button"
                    onClick={() => {
                      setForgotEmailError("");
                      setForgotUsernameError("");
                      setIsModalOpen(false);
                    }}
                  />
                  <Button
                    label={translations.forgot_password.reset_password_button}
                    variant="primary"
                    className="w-[40%]"
                    type="button"
                    onClick={handleForgotPassword}
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}