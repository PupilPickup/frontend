import { useState } from "react";
import { validatePassword, validateConfirmPassword } from "../../../schema/signupSchema";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../../../context/SignupContext";
import Button from "../../../components/common/Button";
import styles from "../../../styles/Auth.module.css"
import axios from "axios";


export default function SignupStep2 () {

  const navigate = useNavigate();
  const { signupData, setSignupData } = useSignup(); 

  const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  const { firstName, lastName, phone } = signupData;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

    setSignupData({
      username,
      email,
      password,
    });


		// Combine data from Step 1 and Step 2
    const formData = {
      firstName,
      lastName,
      email,
      phone,
      username,
      password,
    };

    try {
      const response = await axios.post(`${apiUrl}/register`, formData);
      console.log("Registration successful:", response.data);

      navigate("/signup/complete");
    } catch (error) {
      console.error("Error during registration:", error);
    }
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
								type="text"
								id="username"
								name="username"
								className="input"
								required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
							/>
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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