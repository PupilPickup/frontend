import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LanguageSelect from "../common/LanguageSelect";
import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";
import NavHeaderLink from "../common/NavLink";

interface HeaderProps {
    changeLanguage: (language: string) => void;
    setIsLoggedIn:(isLoggedIn: boolean) => void;
    setIsAdmin: (isAdmin: boolean) => void;
}

const Header: React.FC<HeaderProps> = ( { changeLanguage, setIsLoggedIn, setIsAdmin } ) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const translations = language === 'ne' ? neTranslations : enTranslations;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    // Perform logout logic here (e.g., clearing tokens, resetting state)
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("user_name");
    setIsLoggedIn(false); // Update the logged-in state in context or parent component
    setIsAdmin(false); // Reset admin state if applicable
    console.log("User logged out");
    navigate("/login"); // Redirect to login page
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };
  // Close dropdown when clicking outside
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            closeDropdown();
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          <ul className="hidden sm:flex space-x-6">
            <li>
              <NavHeaderLink btnText={translations.header.profile} navTo={"/profile"}/>
            </li>
            <li>
            <NavHeaderLink btnText={translations.header.children} navTo={"/my-children"}/>
            </li>
            <li>
              <NavHeaderLink btnText={translations.header.vehicles} navTo={"/my-vehicles"}/>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden hover:text-gray-200"
            onClick={toggleDropdown}
          >
            {translations.header.manage}
          </button>

          {/* Dropdown Menu for Mobile */}
          {isDropdownOpen && (
              <div 
                ref={dropdownRef}
                className="absolute top-16 left-4 bg-[#3498DB] text-white rounded shadow-lg z-50 w-[9rem]"
              >
                  <ul className="flex flex-col space-y-2 w-full">
                      <li onClick={closeDropdown} className="w-full p-4 hover:bg-[#2C3E50] active:bg-[#2C3E50]">
                          <NavHeaderLink 
                            btnText={translations.header.profile} 
                            navTo={"/profile"} 
                          />
                      </li>
                      <li onClick={closeDropdown} className="w-full p-4 hover:bg-[#2C3E50] active:bg-[#2C3E50]">
                          <NavHeaderLink 
                            btnText={translations.header.children} 
                            navTo={"/my-children"} 
                          />
                      </li>
                      <li onClick={closeDropdown} className="w-full p-4 hover:bg-[#2C3E50] active:bg-[#2C3E50]">
                          <NavHeaderLink 
                            btnText={translations.header.vehicles} 
                            navTo={"/my-vehicles"} 
                          />
                      </li>
                  </ul>
              </div>
          )}

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