import { useSignup } from "../../../context/SignupContext";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";
import WeShare from "../../../assets/icons/Weshare.svg"


export default function SignupStep1() {
  const navigate = useNavigate();
  const { signupData, setSignupData } = useSignup();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/signup/2");
  };

  return (
    <div className="px-4 pb-4">
			<div className="flex justify-center">
				<img src={WeShare} alt="WeShare Icon" />
			</div>
      <header className="flex flex-col text-center mb-6">
        <h1 className="text-3xl font-bold">Get Started Now</h1>
        <p className="text-sm w-1/2 mx-auto">Step 1 of 2: Basic Information</p>
      </header>

      <form className="space-y-6 mx-6" onSubmit={handleNextStep}>
        <fieldset className="space-y-2">
          <div className="flex flex-col">
            <label htmlFor="first-name" className="label">First Name</label>
            <input
              type="text"
              id="first-name"
              name="firstName"
              className="input"
              required
              value={signupData.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="last-name" className="label">Last Name</label>
            <input
              type="text"
              id="last-name"
              name="lastName"
              className="input"
              required
              value={signupData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone" className="label">Phone Number</label>
            <input
              type="phone"
              id="phone"
              name="phone"
              className="input"
							placeholder="+977XXXXXXXXX"
              required
              value={signupData.phone}
              onChange={handleChange}
            />
          </div>

        </fieldset>

        <Button label="Continue" variant="primary" className="w-full p-2 rounded-md" type="submit" />
      </form>
    </div>
  );
};