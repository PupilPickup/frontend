import './App.css';
// import ParentProfile from './pages/ParentProfile'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from './pages/auth/Auth';
import SignUpPage from './pages/auth/Signup';
// import SignupStep1 from "./components/signup/SignupStep1";
// import SignupStep2 from "./components/signup/SignupStep2";
// import SignupSuccess from "./components/signup/SignupSuccess";
import LoginPage from './pages/auth/Login';
import Dashboard from './pages/dashboard';
import { useState } from 'react';

function App() {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  function changeLanguage(language: string):void {
    localStorage.setItem('language', language);
  }


  return (
    <main>
      <div>
        <button onClick={() => changeLanguage("en")}>{`EN`}</button>
        <button onClick={() => changeLanguage("ne")}>{`NE`}</button>
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup/*" element={<SignUpPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
