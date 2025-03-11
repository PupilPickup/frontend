import { useNavigate } from "react-router-dom"
import Button from "../../../components/common/Button"
import WeShare from "../../../assets/icons/Weshare.svg"


export default function SignupSuccess () {

	 const navigate = useNavigate();

	 const handleLoginClick = () => {
    navigate("/login"); 
  };

	return (
		<div className="p-4">
			<div className="flex justify-center">
				<img src={WeShare} alt="WeShare Icon" />
			</div>
			<header className="flex flex-col text-center mb-6 gap-4">
				<h1 className="text-3xl font-bold">Sign Up Successful!</h1>
				<p className="text-sm w-3/4 mx-auto">Thanks for joining our ride-sharing community!</p>
				<p className="text-sm max-w-[400px] mx-auto">We're committed to providing a safe and reliable transportation option for parents to book rides for their children.</p>
			</header>
			<Button 
				label="Login"
				variant="primary"
				className="w-full p-2 rounded-md"
				type="button"
				onClick={handleLoginClick}
			/>
		</div>
	);
}