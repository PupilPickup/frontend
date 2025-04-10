import React from "react";
import { Link, useNavigate } from "react-router-dom";
import LanguageSelect from "../common/LanguageSelect";
import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import NavHeaderLink from "../common/NavLink";

interface HeaderProps {
    changeLanguage: (language: string) => void;
    setIsLoggedIn:(isLoggedIn: boolean) => void
}

const Header: React.FC<HeaderProps> = ( { changeLanguage, setIsLoggedIn } ) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const translations = language === 'ne' ? neTranslations : enTranslations;

  const handleLogout = () => {
    // Perform logout logic here (e.g., clearing tokens, resetting state)
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("user_name");
    setIsLoggedIn(false); // Update the logged-in state in context or parent component
    console.log("User logged out");
    navigate("/login"); // Redirect to login page
  };

  return (
    <header>
      <nav className="bg-[#3498DB] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo or Dashboard Title */}
          <div className="text-xl font-bold">
            <Link to="/dashboard" className="hover:text-gray-200">
              WeShare
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="flex space-x-6">
            <li>
              <NavHeaderLink btnText={translations.header.profile} navTo={"/profile"}/>
            </li>
            <li>
            <NavHeaderLink btnText={translations.header.children} navTo={"/my_children"}/>
            </li>
            <li>
              <NavHeaderLink btnText={translations.header.vehicles} navTo={"/my_vehicles"}/>
            </li>
          </ul>

          {/* Language Selector */}
          <LanguageSelect changeLanguage={changeLanguage} />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="hover:text-gray-200"
          >
            {translations.header.logout}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;