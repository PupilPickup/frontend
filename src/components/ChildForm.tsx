import React from "react";
import enTranslations from "../languages/en.json";
import neTranslations from "../languages/ne.json";
import { useLanguage } from "../context/LanguageContext";
import { useEffect } from "react";
import FormInput from "./common/FormInput";
import FormSelect from "./common/FormSelect";
import FormGradeSelect from "./common/FormGradeSelect";
import { useTimeFormat } from "../context/TimeFormatContext";

type ChildFormProps = {
    firstName: string;
    lastName: string;
    grade: string;
    pickupTime: string;
    dropoffTime: string;
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
    setGrade : (value: string) => void;
    setPickupTime: (value: string) => void;
    setDropoffTime: (value: string) => void;
    firstNameError: string;
    lastNameError: string;
    gradeError: string;
    pickupTimeError: string;
    dropoffTimeError: string;
};

const ChildForm: React.FC<ChildFormProps> = ({
    firstName,
    lastName,
    grade,
    pickupTime,
    dropoffTime,
    setFirstName,
    setLastName,
    setGrade,
    setPickupTime,
    setDropoffTime,
    firstNameError,
    lastNameError,
    gradeError,
    pickupTimeError,
    dropoffTimeError,

}) => {

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;
    const { timeFormat } = useTimeFormat();
    
    useEffect(() => {
        // This effect runs when the component mounts or when the language changes
        // You can add any side effects here if needed
    }, [language]);

    return (
        <div className="border rounded-lg shadow-md p-4 mb-4 bg-white dark:bg-[#3498DB] text-black dark:text-white">
                        
            <FormInput
                label={translations.children.first_name_label}
                elementId="firstName"
                changeHandler={setFirstName}
                value={firstName}
                error={firstNameError}
            />
            <FormInput
                label={translations.children.last_name_label}
                elementId="lastName"
                changeHandler={setLastName}
                value={lastName}
                error={lastNameError}
            />

            <FormGradeSelect
                label={translations.children.grade_label}
                elementId="grade"
                changeHandler={setGrade}
                value={grade}
                error={gradeError}
            />

            <FormSelect
                label={translations.children.school_arrival_time_label}
                elementId="dropoffTime"
                changeHandler={setDropoffTime}
                value={dropoffTime}
                error={dropoffTimeError}
                timeFormat={timeFormat}
            />

            <FormSelect
                label={translations.children.school_departure_time_label}
                elementId="pickupTime"
                changeHandler={setPickupTime}
                value={pickupTime}
                error={pickupTimeError}
                timeFormat={timeFormat}
            />
        </div>
    );
};

export default ChildForm;