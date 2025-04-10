import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChangePassword: React.FC = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSave = async () => {
        if (newPassword !== confirmPassword) {
            setErrorMessage("New password and confirmation do not match.");
            return;
        }

        try {
            // Replace with your API call to change the password
            console.log("Changing password...");
            console.log({ oldPassword, newPassword });

            // Simulate success
            alert("Password changed successfully!");
            navigate("/profile"); // Redirect to the profile page
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to change password. Please try again.");
        }
    };

    const handleCancel = () => {
        navigate("/profile"); // Redirect to the profile page
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <h1 className="text-2xl font-bold mb-6">Change Password</h1>
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
                )}
                <div className="mb-4">
                    <label htmlFor="oldPassword" className="block text-sm font-medium mb-1">
                        Old Password
                    </label>
                    <input
                        type="password"
                        id="oldPassword"
                        className="w-full border rounded px-3 py-2"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                        New Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        className="w-full border rounded px-3 py-2"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="w-full border rounded px-3 py-2"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleCancel}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;