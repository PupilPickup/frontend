import { useState } from "react";
import { validatePassword, validateConfirmPassword } from "../../../schema/signupSchema";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";
import styles from "../../../styles/Auth.module.css"
import WeShare from "../../../assets/icons/Weshare.svg"


export default function SignupStep2 () {

	const navigate = useNavigate();
  
  const goBack = () => {
    navigate(-1); 
  };

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters, contain a number, an uppercase letter, and a special character.");
      return;
    }

    if (!validateConfirmPassword(password, confirmPassword)) {
      console.log("Passwords do not match!");
      return;
    }

		navigate('/signup/complete');
    console.log("Form submitted successfully!");
  };

  return (
    <div className="p-4 ">
      <header className="flex flex-col text-center mb-6">
        <h1 className="text-3xl font-bold">Complete Your Profile </h1>
        <p className="text-sm w-1/2 mx-auto">Step 2 of 2: Account Details</p>
      </header>

      <form className="space-y-6 mx-6" onSubmit={handleSubmit}>
        <fieldset className="space-y-2">
          
					<div className="flex flex-col">
							<label htmlFor="username" className="label">Username</label>
							<input
								type="username"
								id="username"
								name="username"
								className="input"
								required
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
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <span className="text-red-500 text-sm mt-1">{passwordError}</span>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="input"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {isSubmitted && password !== confirmPassword && (
              <span className="text-red-500 text-sm mt-1">Passwords do not match!</span>
            )}
          </div>
        </fieldset>

				<div className='flex flex-row gap-2'>
					<Button label="Create Account" variant="primary" className="btn-primary w-full" type="submit" />
				</div>
      </form>
    </div>
  );
};