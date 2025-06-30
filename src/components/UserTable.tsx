import React from 'react'
import enTranslations from "../languages/en.json";
import neTranslations from "../languages/ne.json";
import { useLanguage } from "../context/LanguageContext";
import PendingRow from './PendingRow';

type UserTableProps = {
    pendingUserList: any[];
    tableType: 'pending' | 'all';
    pendingRoleName?: string;
    pendingRoleId?: string;
    approvingRoleId?: string;
    rejectingRoleId?: string;
};

const UserTable: React.FC<UserTableProps> = ({ pendingUserList, tableType, pendingRoleName, pendingRoleId, approvingRoleId, rejectingRoleId  }) => {
    
    const { language } = useLanguage();
    const translations = language === 'ne' ? neTranslations : enTranslations;

    // Function to handle approving a user for a role
    const handleApprove = async (userId: string, username: string) => {
        // TODO: Implement the approve logic
        console.log(`Approving user: ${username} with ID: ${userId}`);
    }

    // Function to handle rejecting a user for a role
    const handleReject = async (userId: string, username: string) => {
        // TODO: Implement the reject logic
        console.log(`Rejecting user: ${username} with ID: ${userId}`);
    }

    return (
        <div>
            {pendingUserList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-center items-center">
                    {pendingUserList.map((user: any) => (
                        <PendingRow
                            key={user.userId}
                            username={user.username}
                            userId={user.userId}
                            email={user.email}
                            firstName={user.firstName}
                            lastName={user.lastName}
                            onApprove={handleApprove}
                            onReject={handleReject}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center mt-4">{"TODO"}</div>
            )}
        </div>
    )
}

export default UserTable