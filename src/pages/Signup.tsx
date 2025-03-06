import { useState } from "react";
import { validatePassword, validateConfirmPassword } from "../schema/signupSchema"; // Adjust the path as needed
import styles from "../styles/Signup.module.css";

export default function SignUpPage () {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswodError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validatePassword(password)) {
      setPasswodError("Password must be at least 8 characters, contain a number, an uppercase letter, and a special character.");
      return;
    }

    if (!validateConfirmPassword(password, confirmPassword)) {
      console.log("Passwords do not match!");
      return;
    }

    console.log("Form submitted successfully!");
  };

  return (
    <div className='my-4'>
      <header className="flex flex-col text-center my-6">
        <h1 className="text-3xl font-bold">Get Started Now</h1>
        <p className="text-sm w-1/2 mx-auto">Create an account or login to start your ride share</p>
      </header>

      <form className="space-y-6 mx-6" onSubmit={handleSubmit}>
        <fieldset className="space-y-2">
          <div className="flex flex-col">
            <label htmlFor="first-name" className={styles.label}>First Name</label>
            <input
              type="text"
              id="first-name"
              name="first-name"
              className="p-2 border rounded-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="last-name" className={styles.label}>Last Name</label>
            <input
              type="text"
              id="last-name"
              name="last-name"
              className="p-2 border rounded-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="p-2 border rounded-md"
              required
            />
          </div>

					<div className="flex flex-col">
            <label htmlFor="phone" className={styles.label}>Phone Number</label>
            <input
              type="phone"
              id="phone"
              name="phone"
              className="p-2 border rounded-md"
							placeholder="+977XXXXXXXXX"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="p-2 border rounded-md"
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
              className="p-2 border rounded-md"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {isSubmitted && password !== confirmPassword && (
              <span className="text-red-500 text-sm mt-1">Passwords do not match!</span>
            )}
          </div>
        </fieldset>

        <button type="submit" className="p-2 w-full bg-blue-500 text-white rounded-md">
          Sign Up
        </button>
      </form>
    </div>
  );
};