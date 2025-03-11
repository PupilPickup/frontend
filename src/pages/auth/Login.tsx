import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validatePassword } from "../../schema/loginSchema";
import Button from "../../components/common/Button";
import styles from "../../styles/Auth.module.css";
import WeShare from "../../assets/icons/Weshare.svg";

export default function LoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters, contain a number, an uppercase letter, and a special character."
      );
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="p-4">
      <div className="flex justify-center">
        <img src={WeShare} alt="WeShare Icon" />
      </div>
      <header className="flex flex-col text-center mb-6">
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        <p className="text-sm mx-auto">Log in to start booking your ride.</p>
      </header>

      <form className="space-y-6 mx-6" onSubmit={handleSubmit}>
        <fieldset className="space-y-2">
          <div className="flex flex-col">
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="input"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <span className="text-red-500 text-sm mt-1">{passwordError}</span>
            )}
          </div>
        </fieldset>

        <Button
          label="Login"
          variant="primary"
          className="w-full p-2 rounded-md"
          type="submit"
        />
      </form>
    </div>
  );
}