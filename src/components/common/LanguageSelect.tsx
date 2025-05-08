import { useLanguage } from "../../context/LanguageContext";
import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";

interface LanguageSelectProps {
    changeLanguage: (language: string) => void;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ( { changeLanguage } ) => {

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    return (
        <div>
            <button className='text-sm px-2' onClick={() => changeLanguage("en")}>
                {translations.languages.english_shorthand}
            </button>
            | 
            <button className='text-sm px-2' onClick={() => changeLanguage("ne")}>
                {translations.languages.nepali_shorthand}
            </button>
        </div>
    );
};

export default LanguageSelect;