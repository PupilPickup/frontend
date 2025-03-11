import { useSignup } from "../../../context/SignupContext";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";
import WeShare from "../../../assets/icons/Weshare.svg";
import enTranslations from "../../../languages/en.json";
import neTranslations from "../../../languages/ne.json";
import { useLanguage } from "../../../context/LanguageContext";
import { useEffect, useState } from "react";
import { isFieldEmpty, isNameValid, isPhoneValid } from "../../../schema/signupSchema";


export default function SignupStep1() {
  const navigate = useNavigate();
  const { signupData, setSignupData } = useSignup();
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const { language } = useLanguage();
  const translations = language === 'ne' ? neTranslations : enTranslations;

  // Reset the error messages when the language changes
  useEffect(() => {
    setFirstNameError("");
    setLastNameError("");
    setPhoneError("");
  },[language]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError: boolean = false;
    if(isFieldEmpty(signupData.firstName)){
      hasError = true;
      setFirstNameError(translations.sign_up.require_first_name_error);

    }else if(!isNameValid(signupData.firstName)){
      hasError = true;
      setFirstNameError(translations.sign_up.invalid_first_name_error);

    }else{
      setFirstNameError("");
    }

    if(isFieldEmpty(signupData.lastName)){
      hasError = true;
      setLastNameError(translations.sign_up.require_last_name_error);

    }else if(!isNameValid(signupData.lastName)){
      hasError = true;
      setLastNameError(translations.sign_up.invalid_last_name_error);

    }else{
      setLastNameError("");
    }

    if(isFieldEmpty(signupData.phone)){
      hasError = true;
      setPhoneError(translations.sign_up.require_phone_number_error);

    }else if(!isPhoneValid(signupData.phone)){
      hasError = true;
      setPhoneError(translations.sign_up.invalid_phone_number_error);
    }else{
      setPhoneError("");
    }

    if(hasError){
      return;
    }
    
    navigate("/signup/2");
  };

  return (
    <div className="px-4 pb-4">
			<div className="flex justify-center">
				<img src={WeShare} alt={translations.sign_up.alt_logo_text} />
			</div>
      <header className="flex flex-col text-center mb-6">
        <h1 className="text-3xl font-bold">{translations.sign_up.header1}</h1>
        <p className="text-sm w-1/2 mx-auto">{translations.sign_up.prompt1}</p>
      </header>

      <form className="space-y-6 mx-6" onSubmit={handleNextStep}>
        <fieldset className="space-y-2">
          <div className="flex flex-col">
            <label htmlFor="first-name" className="label">{translations.sign_up.first_name_label}</label>
            <input
              type="text"
              id="first-name"
              name="firstName"
              className="input"
              value={signupData.firstName}
              onChange={handleChange}
            />
            {firstNameError && (
              <span className="text-red-500 text-sm mt-1">{firstNameError}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="last-name" className="label">{translations.sign_up.last_name_label}</label>
            <input
              type="text"
              id="last-name"
              name="lastName"
              className="input"
              value={signupData.lastName}
              onChange={handleChange}
            />
            {lastNameError && (
              <span className="text-red-500 text-sm mt-1">{lastNameError}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone" className="label">{translations.sign_up.phone_number_label}</label>
            <input
              type="phone"
              id="phone"
              name="phone"
              className="input"
							placeholder={translations.sign_up.phone_placeholder}
              value={signupData.phone}
              onChange={handleChange}
            />
            {phoneError && (
              <span className="text-red-500 text-sm mt-1">{phoneError}</span>
            )}
          </div>

        </fieldset>

        <Button label={translations.sign_up.next_button} variant="primary" className="w-full p-2 rounded-md" type="submit" />
      </form>
    </div>
  );
};