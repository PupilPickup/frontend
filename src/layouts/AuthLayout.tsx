import React from "react";
import AuthNavbar from "../components/layout/AuthNavbar";

interface AuthLayoutProps {
	children: React.ReactNode;
}

const AuthLayout:React.FC<AuthLayoutProps> = ({children}) => {
	return (
		<div>
			<AuthNavbar />
			<div>
				{children}
			</div>
		</div>
	);
};

export default AuthLayout;