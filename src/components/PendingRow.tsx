import React from 'react'
import Button from './common/Button';
import enTranslations from "../languages/en.json";
import neTranslations from "../languages/ne.json";
import { useLanguage } from "../context/LanguageContext";

type PendingRowProps = {
    username: string;
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    onApprove: (userId: string, username: string) => void;
    onReject: (userId: string, username: string) => void;

};

const PendingRow = ( {username, userId, email, firstName, lastName, onApprove, onReject}: PendingRowProps) => {

    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    return (
        <div className='flex flex-row items-start justify-between p-2 mb-2 w-full'>
            <div className='flex flex-col items-center gap-2'>
                <p>{username}</p>
            </div>
            <div className='flex flex-col items-center gap-2'>
                <p>{email}</p>
            </div>
            <div className='flex flex-col items-center gap-2'>
                <p>{firstName} {lastName}</p>
            </div>
            <div className='flex flex-col items-center gap-2'>
                <Button label={translations.universal.approve} variant='primary' onClick={() => onApprove(userId, username)}/>
                <Button label={translations.universal.reject} variant='secondary' onClick={() => onReject(userId, username)}/>
            </div>
        </div>
    )
}

export default PendingRow