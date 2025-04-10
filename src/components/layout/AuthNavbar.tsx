import { useNavigate } from "react-router-dom";
// import { useState } from "react";

import arrowleft from "../../assets/icons/arrowleft.svg";

export default function AuthNavbar () {

	const navigate = useNavigate();
	// const [language, setLanguage] = useState("en");

	return (
		<nav className="flex justify-between items-center px-4 pt-4">
			<button 
				onClick={() => navigate(-1)}>
				<img src={arrowleft} alt="back"/>
			</button>
		</nav>
	);
};