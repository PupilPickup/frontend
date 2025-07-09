import React, { useEffect } from 'react'
import enTranslations from "../languages/en.json";
import neTranslations from "../languages/ne.json";
import { useLanguage } from "../context/LanguageContext";
import UserRow from './UserRow';
import { FullProfileData } from '../schema/types';
import { useNavigate } from "react-router-dom";

type UserTableProps = {
    userList: FullProfileData[];
};

const UserTable: React.FC<UserTableProps> = ({ userList }) => {
    
    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;
    const navigate = useNavigate();

    // Function to handle user row click and navigate to an administrative user profile
    const handleUserClick = (userId: string) => {
        navigate(`/user/${userId}`);
    };

    useEffect(() => {
        // Reset the scroll position to the top when the user list changes or language changes
        window.scrollTo(0, 0);
    }, [userList, translations]);

    return (
        <div>
            {userList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-center items-center">
                    <div className="flex flex-row items-center justify-between p-2 mb-2 w-full bg-gray-200">
                        <p className="font-bold">{translations.users.username}</p>
                        <p className="font-bold">{translations.users.email}</p>
                        <p className="font-bold">{translations.users.name}</p>
                        <p className="font-bold">{translations.users.contact_number}</p>
                    </div>
                    <div>
                        {userList.map((user: FullProfileData) => (
                            <UserRow
                                key={user.userId}
                                user={user}
                                onClick={() => handleUserClick(user.userId)}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center mt-4">{translations.users.no_users}</div>
            )}
        </div>
    )
}

export default UserTable