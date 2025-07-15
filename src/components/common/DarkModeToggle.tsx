import { useDarkMode } from "../../context/DarkModeContext";
import { useLanguage } from "../../context/LanguageContext";
import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";

export default function DarkModeToggle() {
    const { darkMode, toggleDarkMode } = useDarkMode();

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    return (
        <label className="flex items-center cursor-pointer ml-2">
            <div className="relative">
                <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={toggleDarkMode}
                    className="sr-only"
                    aria-label={translations.theme.dark_mode_aria_text}
                />
                <div className="block w-10 h-6 bg-gray-300 rounded-full dark:bg-gray-700"></div>
                <div
                    className={`dot absolute left-1 top-1 w-4 h-4 rounded-full transition ${
                        darkMode ? "translate-x-4 bg-[#3498DB]" : "bg-gray-500"
                    }`}
                ></div>
            </div>
            <span className="ml-3 text-sm dark:text-white">
                {darkMode ? translations.theme.dark : translations.theme.light}
            </span>
        </label>
    );
}