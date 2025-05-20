import { useEffect, useState } from "react";
import { validatePassword, validateConfirmPassword, isFieldEmpty, isUsernameValid, isEmailValid } from "../../../schema/signupSchema";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../../../context/SignupContext";
import Button from "../../../components/common/Button";
import axios from "axios";
import enTranslations from "../../../languages/en.json";
import neTranslations from "../../../languages/ne.json";
import { useLanguage } from "../../../context/LanguageContext";
import ProfileInput from "../../../components/common/ProfileInput";
import FormInput from "../../../components/common/FormInput";

// Define the possible error keys
type SignupServerErrors = 'empty_fields' | 'firstname_length' | 'lastname_length' |'username_length' |'email_length' |'phone_length' |'username_exists' |  'email_exists' | 'server_error' | 'generic_error';

export default function SignupStep3 () {

  const navigate = useNavigate();
  const { signupData, setSignupData, resetSignupData } = useSignup(); 

  const { language } = useLanguage();
  const translations = language === 'ne' ? neTranslations : enTranslations;

  // Reset the error messages when the language changes
  useEffect(() => {
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
  },[language]);

  const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  const { firstName, lastName, phoneNumber, streetAddress, wardNumber, municipalityDistrict } = signupData;

  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setServerError("");
  }, [language]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  function clearFieldsOnSignup(){
    setConfirmPassword("");
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setServerError("");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError: boolean = false;

    setServerError("");

    const email = signupData.email;
    const username = signupData.username;
    const password = signupData.password

    if(isFieldEmpty(username)){
      hasError = true;
      setUsernameError(translations.sign_up.require_username_error);
    }else if(!isUsernameValid(username)){
      hasError = true;
      setUsernameError(translations.sign_up.invalid_username_error);
    }else{
      setUsernameError("");
    }

    if(isFieldEmpty(email)){
      hasError = true;
      setEmailError(translations.sign_up.require_email_error);
    }else if(!isEmailValid(email)){
      hasError = true;
      setEmailError(translations.sign_up.invalid_email_error);
    }else{
      setEmailError("");
    }

    if (!validatePassword(password)) {
      hasError = true;
      setPasswordError(translations.sign_up.password_requirements_error);
    }else{
      setPasswordError("");
    }

    if (!validateConfirmPassword(password, confirmPassword)) {
      hasError = true;
      setConfirmPasswordError(translations.sign_up.password_mismatch_error);
    }else{
      setConfirmPasswordError("");
    }

    if (hasError) {
      return;
    }

		// Combine data from Step 1 and Step 2 and Step 3
    const formData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      streetAddress,
      wardNumber,
      municipalityDistrict,
      username,
      password,
    };

    try {
      await axios.post(`${apiUrl}/users/register`, formData);
      clearFieldsOnSignup();
      resetSignupData();
      navigate("/signup/complete");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorKey = error.response.data.error as SignupServerErrors;
        let errorMessage: string = translations.signup_server_errors[errorKey] || translations.signup_server_errors.generic_error;

        if(errorMessage.includes("$username}")){
          errorMessage = errorMessage.replace("$username}", username);
        }
        if(errorMessage.includes("$email}")){
          errorMessage = errorMessage.replace("$email}", email);
        }

        if(!!error.response.data.server_error){
          console.error("Error during registration:", error.response.data.server_error);
        }

        setServerError(errorMessage);

      }
    }
  };

  return (
    <div className="px-4 pb-4 flex flex-col w-full items-center">
      <div className="w-full sm:max-w-[52rem]">
        <header className="flex flex-col text-center mb-6">
          <h1 className="text-3xl font-bold">{translations.sign_up.header3}</h1>
          <p className="text-sm w-1/2 mx-auto">{translations.sign_up.prompt3}</p>
        </header>

        <form className="flex flex-col space-y-6 mx-6" onSubmit={handleSubmit}>
          <fieldset className="space-y-2">
            <div className="flex flex-col">
              <ProfileInput
                label={translations.sign_up.username_label}
                elementId="username"
                value={signupData.username}
                changeHandler={handleChange}
                error={usernameError}
              />
            </div>

            <div className="flex flex-col">
              <ProfileInput
                label={translations.sign_up.email_label}
                elementId="email"
                value={signupData.email}
                changeHandler={handleChange}
                error={emailError}
              />
            </div>

            <div className="flex flex-col">
              <ProfileInput
                label={translations.sign_up.password_label}
                elementId="password"
                value={signupData.password}
                changeHandler={handleChange}
                error={passwordError}
                isPassword={true}
              />
            </div>

            <div className="flex flex-col">
              <FormInput
                label={translations.sign_up.confirm_password_label}
                elementId="confirmPassword"
                value={confirmPassword}
                changeHandler={setConfirmPassword}
                error={confirmPasswordError}
                isPassword={true}
              />
            </div>
            {serverError && (
              <span className="text-red-500 text-sm mt-1">{serverError}</span>
            )}
          </fieldset>

          <div className='flex flex-row gap-2'>
            <Button 
              label={translations.sign_up.submit_button} 
              variant="primary" 
              className="w-full p-2 rounded-md" 
              type="submit" 
            />
          </div>
        </form>
      </div>
    </div>
  );
};