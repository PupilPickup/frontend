//Page that allows user to sign up or login


import WeShare from "../../assets/icons/Weshare.svg";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";

export default function AuthPage () {
	const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/signup/1");
  };

	const handleLoginClick = () => {
		navigate("/login")
	}

	return (
		<div className='flex flex-col min-h-screen mx-2'>
			{/* Logo */}
			<div className="flex-grow flex justify-center items-center">
				<img src={WeShare} alt="WeShare Icon" />
			</div>

			{/* Buttons */}
			<div className="flex flex-col gap-2 justify-evenly pb-24">
				<Button 
					label="Log In" 
					variant="primary" 
					onClick={handleLoginClick}
					className="w-full p-2 rounded-md" /> 
				<Button 
					label="Sign Up"
					variant="secondary" 
					onClick={handleSignUpClick}
					className="w-full p-2 rounded-md" />
			</div>
		</div>	
	);
}