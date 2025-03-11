import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validatePassword } from "../../schema/loginSchema";
import Button from "../../components/common/Button";
import styles from "../../styles/Auth.module.css";
import WeShare from "../../assets/icons/Weshare.svg";
import enTranslations from "../../languages/en.json";
import neTranslations from "../../languages/ne.json";
import { useLanguage } from "../../context/LanguageContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { language } = useLanguage();
  const translations = language === 'ne' ? neTranslations : enTranslations;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(username.length === 0){
      setUsernameError(translations.login.require_username_error);
      return;
    }

    if(password.length === 0){
      setPasswordError(translations.login.require_password_error);
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        translations.login.password_error_message
      );
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="p-4">
      <div className="flex justify-center">
        <img src={WeShare} alt={translations.login.alt_logo_text} />
      </div>
      <header className="flex flex-col text-center mb-6">
        <h1 className="text-3xl font-bold">{translations.login.welcome_back_message}</h1>
        <p className="text-sm mx-auto">{translations.login.login_prompt_message}</p>
      </header>

      <form className="space-y-6 mx-6" onSubmit={handleSubmit}>
        <fieldset className="space-y-2">
          <div className="flex flex-col">
            <label htmlFor="username" className={styles.label}>
              {translations.login.username_label}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && (
              <span className="text-red-500 text-sm mt-1">{usernameError}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className={styles.label}>
              {translations.login.password_label}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <span className="text-red-500 text-sm mt-1">{passwordError}</span>
            )}
          </div>
        </fieldset>

        <Button
          label={translations.login.login_button}
          variant="primary"
          className="w-full p-2 rounded-md"
          type="submit"
        />
      </form>
    </div>
  );
}