import { use, useEffect, useState } from "react";
import { validatePassword, validateConfirmPassword, isFieldEmpty, isUsernameValid, isEmailValid } from "../../../schema/signupSchema";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../../../context/SignupContext";
import Button from "../../../components/common/Button";
import styles from "../../../styles/Auth.module.css"
import axios from "axios";
import enTranslations from "../../../languages/en.json";
import neTranslations from "../../../languages/ne.json";
import { useLanguage } from "../../../context/LanguageContext";


export default function SignupStep2 () {

  const navigate = useNavigate();
  const { signupData, setSignupData } = useSignup(); 

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

  const { firstName, lastName, phoneNumber } = signupData;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    let hasError: boolean = false;

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

    setSignupData({
      username,
      email,
      password,
    });


		// Combine data from Step 1 and Step 2
    const formData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      username,
      password,
    };

    try {
      const response = await axios.post(`${apiUrl}/users/register`, formData);
      console.log("Registration successful:", response.data);

      navigate("/signup/complete");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="p-4 ">
      <header className="flex flex-col text-center mb-6">
        <h1 className="text-3xl font-bold">{translations.sign_up.header2}</h1>
        <p className="text-sm w-1/2 mx-auto">{translations.sign_up.prompt2}</p>
      </header>

      <form className="space-y-6 mx-6" onSubmit={handleSubmit}>
        <fieldset className="space-y-2">
          
					<div className="flex flex-col">
							<label htmlFor="username" className="label">{translations.sign_up.username_label}</label>
							<input
								type="text"
								id="username"
								name="username"
								className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
							/>
              {usernameError && (
              <span className="text-red-500 text-sm mt-1">{usernameError}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="label">{translations.sign_up.email_label}</label>
            <input
              type="text"
              id="email"
              name="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && (
              <span className="text-red-500 text-sm mt-1">{emailError}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="label">{translations.sign_up.password_label}</label>
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
          </div>

          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className={styles.label}>{translations.sign_up.confirm_password_label}</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPasswordError && (
              <span className="text-red-500 text-sm mt-1">{confirmPasswordError}</span>
            )}
          </div>
        </fieldset>

				<div className='flex flex-row gap-2'>
					<Button label={translations.sign_up.submit_button} variant="primary" className="btn-primary w-full" type="submit" />
				</div>
      </form>
    </div>
  );
};