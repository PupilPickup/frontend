import { useSignup } from "../../../context/SignupContext";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";
import WeShare from "../../../assets/icons/Weshare.svg";
import enTranslations from "../../../languages/en.json";
import neTranslations from "../../../languages/ne.json";
import { useLanguage } from "../../../context/LanguageContext";
import { useEffect, useState } from "react";
import { isFieldEmpty, isMunicipalityOrDistrictValid, isStreetAddressValid, isWardValid } from "../../../schema/signupSchema";


export default function SignupStep2() {
  const navigate = useNavigate();
  const { signupData, setSignupData } = useSignup();
  const [addressError, setAddressError] = useState("");
  const [wardError, setWardError] = useState("");
  const [municipalityError, setMunicipalityError] = useState("");

  const { language } = useLanguage();
  const translations = language === 'ne' ? neTranslations : enTranslations;

  // Reset the error messages when the language changes
  useEffect(() => {
    setAddressError("");
    setWardError("");
    setMunicipalityError("");
  },[language]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError: boolean = false;
    if(isFieldEmpty(signupData.streetAddress)){
      hasError = true;
      setAddressError(translations.sign_up.require_address_error);

    }else if(!isStreetAddressValid(signupData.streetAddress)){
      hasError = true;
      setAddressError(translations.sign_up.invalid_address_error);

    }else{
      setAddressError("");
    }

    if(isFieldEmpty(signupData.wardNumber)){
      hasError = true;
      setWardError(translations.sign_up.require_ward_error);

    }else if(!isWardValid(signupData.wardNumber)){
      hasError = true;
      setWardError(translations.sign_up.invalid_ward_error);

    }else{
      setWardError("");
    }

    if(isFieldEmpty(signupData.municipalityDistrict)){
      hasError = true;
      setMunicipalityError(translations.sign_up.require_municipality_error);

    }else if(!isMunicipalityOrDistrictValid(signupData.municipalityDistrict)){
      hasError = true;
      setMunicipalityError(translations.sign_up.invalid_municipality_error);
    }else{
      setMunicipalityError("");
    }

    if(hasError){
      return;
    }
    
    navigate("/signup/3");
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
            <label htmlFor="street-address" className="label">{translations.sign_up.address_label}</label>
            <input
              type="text"
              id="street-address"
              name="streetAddress"
              className="input"
              value={signupData.streetAddress}
              onChange={handleChange}
            />
            {addressError && (
              <span className="text-red-500 text-sm mt-1">{addressError}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="ward" className="label">{translations.sign_up.ward_label}</label>
            <input
              type="number"
              min={1}
              id="ward"
              name="ward"
              className="input"
              value={signupData.wardNumber}
              onChange={handleChange}
            />
            {wardError && (
              <span className="text-red-500 text-sm mt-1">{wardError}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="municipality-district" className="label">{translations.sign_up.municipality_label}</label>
            <input
              type="text"
              id="municipality-district"
              name="municipality-district"
              className="input"
							value={signupData.municipalityDistrict}
              onChange={handleChange}
            />
            {municipalityError && (
              <span className="text-red-500 text-sm mt-1">
                {municipalityError}
              </span>
            )}
          </div>

        </fieldset>

        <Button label={translations.sign_up.next_button} variant="primary" className="w-full p-2 rounded-md" type="submit" />
      </form>
    </div>
  );
};