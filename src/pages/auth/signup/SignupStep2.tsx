import { useSignup } from "../../../context/SignupContext";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";
import WeShare from "../../../assets/icons/Weshare.svg";
import enTranslations from "../../../languages/en.json";
import neTranslations from "../../../languages/ne.json";
import { useLanguage } from "../../../context/LanguageContext";
import { useEffect, useState } from "react";
import { isFieldEmpty, isStreetAddressValid } from "../../../schema/signupSchema";
import ProfileInput from "../../../components/common/ProfileInput";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import HelpTip from "../../../components/common/HelpTip";


export default function SignupStep2() {
  const navigate = useNavigate();
  const { signupData, setSignupData } = useSignup();
  const [addressError, setAddressError] = useState("");
  const [position, setPosition] = useState<[number, number]>([27.7172, 85.3240]); // Default to Kathmandu, Nepal

  const { language } = useLanguage();
  const translations = language === 'ne' ? neTranslations : enTranslations;

  // Reset the error messages when the language changes
  useEffect(() => {
    setAddressError("");
  },[language]);

  const handleSearch = async () => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(signupData.streetAddress)}`;

    const res = await fetch(url, {
      headers: { "User-Agent": "CarpoolApp/1.0 (pupilpickup@gmail.com)" }, // required by Nominatim
    });
    const data = await res.json();

    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      setPosition([lat, lon]);
      setAddressError("");
    } else {
      setAddressError(translations.sign_up.address_not_found_error);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  function MapUpdater({ position }: { position: [number, number] }) {
    const map = useMap();
    useEffect(() => {
      map.setView(position, map.getZoom());
    }, [position, map]);
    return null;
  }

  const handleNextStep = () => {

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

    if(hasError){
      return;
    }
    signupData.latitude = position[0];
    signupData.longitude = position[1];
    
    navigate("/signup/3");
  };

  return (
    <div className="px-4 pb-4 flex flex-col w-full items-center">
      <div className="flex justify-start w-full">
        <HelpTip content={translations.help.sign_up_step_2} altText={translations.universal.help_icon}/>
      </div>
      <div className="w-full sm:max-w-[52rem]">
        <div className="flex justify-center">
          <img src={WeShare} alt={translations.sign_up.alt_logo_text} className="bg-white" />
        </div>
        <header className="flex flex-col text-center mb-6">
          <h1 className="text-3xl font-bold">{translations.sign_up.header2}</h1>
          <p className="text-sm w-1/2 mx-auto">{translations.sign_up.prompt2}</p>
        </header>
        <div className="flex flex-col space-y-6 mx-6">
          
          <ProfileInput label={translations.sign_up.address_label} elementId="streetAddress" value={signupData.streetAddress} changeHandler={handleChange} error={addressError} placeholder={translations.sign_up.address_placeholder} />
          <Button 
            label={translations.sign_up.search_button} 
            variant="secondary" className="w-full p-2 rounded-md" 
            onClick={handleSearch} 
          />
          <div className="w-full my-4">
            <MapContainer
              center={position}
              zoom={14}
              style={{ height: "500px", width: "100%" }}
            >
              <MapUpdater position={position} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>Result: {signupData.streetAddress}</Popup>
              </Marker>
            </MapContainer>
          </div>
          <Button 
            label={translations.sign_up.next_button} 
            variant="primary" 
            className="w-full p-2 rounded-md" 
            onClick={handleNextStep}
          />
        </div>
      </div>
    </div>
  );
};