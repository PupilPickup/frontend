import React from "react";
import { Link, useNavigate } from "react-router-dom";
import LanguageSelect from "../common/LanguageSelect";
import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";

interface HeaderProps {
    changeLanguage: (language: string) => void;
}

const Header: React.FC<HeaderProps> = ( { changeLanguage } ) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const translations = language === 'ne' ? neTranslations : enTranslations;

  const handleLogout = () => {
    // Perform logout logic here (e.g., clearing tokens, resetting state)
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("user_name");
    console.log("User logged out");
    navigate("/login"); // Redirect to login page
  };

  return (
    <header>
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo or Dashboard Title */}
          <div className="text-xl font-bold">
            <Link to="/dashboard" className="hover:text-gray-200">
              Dashboard
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="flex space-x-6">
            <li>
              <Link to="/dashboard/profile" className="hover:text-gray-200">
                {translations.header.profile}
              </Link>
            </li>
            <li>
              <Link to="/dashboard/children" className="hover:text-gray-200">
              {translations.header.children}
              </Link>
            </li>
            <li>
              <Link to="/dashboard/vehicles" className="hover:text-gray-200">
              {translations.header.vehicles}
              </Link>
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