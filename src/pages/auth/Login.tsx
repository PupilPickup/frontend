import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validatePassword } from "../../schema/loginSchema";
import Button from "../../components/common/Button";
import styles from "../../styles/Auth.module.css";
import WeShare from "../../assets/icons/Weshare.svg";
import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import axios from "axios";
import FormInput from "../../components/common/FormInput";
import { useUser } from "../../context/UserContext";

// Define the possible error keys
type LoginServerErrors = 'empty_fields' | 'username_not_existent' | 'invalid_credentials' | 'server_error' | 'generic_error';

const LoginPage: React.FC = ( ) => {

  const navigate = useNavigate();
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [usernameEmailError, setUsernameEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const { user, setUser } = useUser();
  const { language } = useLanguage();
  const translations = language === 'ne' ? neTranslations : enTranslations;

  const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    setUsernameEmailError("");
    setPasswordError("");
    setServerError("");
  }, [language]);

  useEffect(() => {
		if ((!!sessionStorage.getItem("token") && !!user)) {
			navigate("/dashboard");
		}
    setIsLoading(false);
	}, [user]);
  
  function clearFieldsOnLogin(){
    setLoginInput("");
    setPassword("");
    setUsernameEmailError("");
    setPasswordError("");
    setServerError("");
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
      sessionStorage.setItem("token", response.data.token);
      clearFieldsOnLogin();
      setUser({username: response.data.user_name, userId: response.data.user_id});
      navigate("/dashboard");

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorKey = error.response.data.error as LoginServerErrors;
        let errorMessage: string = translations.login_server_errors[errorKey] || translations.login_server_errors.generic_error;
        if(errorMessage.includes("${username}")){
          errorMessage = errorMessage.replace("${username}", loginInput);
        }

        if(errorMessage.includes("${email}")){
          errorMessage = errorMessage.replace("${email}", loginInput);
        }

        if(!!error.response.data.server_error){
          console.error("Error during login:", error.response.data.server_error);
        }

        setServerError(errorMessage);

      }
    }
  };

  if(isLoading){
		return <div className="flex justify-center items-center min-h-screen">{translations.universal.loading}</div>
	}

	if(!!user){
		return <div className="flex justify-center items-center min-h-screen">{translations.universal.redirecting}</div>
	}

  return (
    <div className="p-4">
      <div className="flex justify-center">
        <img src={WeShare} alt={translations.login.alt_logo_text} />
      </div>
      <header className="flex flex-col text-center mb-6">
        <h1 className="text-3xl font-bold">{translations.login.welcome_back_message}</h1>
        <p className="text-sm mx-auto">{translations.login.login_prompt_message}</p>
      </header>

      <form className="space-y-6 mx-6" onSubmit={handleSubmit}>
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
            {/* <label htmlFor="username" className={styles.label}>
              {translations.login.username_or_email_label}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="input"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
            />
            {usernameEmailError && (
              <span className="text-red-500 text-sm mt-1">{usernameEmailError}</span>
            )} */}
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
            {/* <label htmlFor="password" className={styles.label}>
              {translations.login.password_label}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <span className="text-red-500 text-sm mt-1">{passwordError}</span>
            )}
          </div> */}
          {serverError && (
            <span className="text-red-500 text-sm mt-1">{serverError}</span>
          )}
        </fieldset>

        <Button
          label={translations.login.login_button}
          variant="primary"
          className="w-full p-2 rounded-md"
          type="submit"
        />
      </form>
    </div>
  );
}
export default LoginPage;