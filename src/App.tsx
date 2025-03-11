import './App.css';
// import ParentProfile from './pages/ParentProfile'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from './pages/auth/Auth';
import SignUpPage from './pages/auth/Signup';
import LoginPage from './pages/auth/Login';
import Dashboard from './pages/dashboard';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function App() {

  // function changeLanguage(language: string):void {
  //   localStorage.setItem('language', language);
  //   window.location.reload();
  // }
  const { changeLanguage } = useLanguage();

  return (
    <main>
      <div className='language-container'>
        <button className='language-buttons' onClick={() => changeLanguage("en")}>{`EN`}</button>
        <button className='language-buttons' onClick={() => changeLanguage("ne")}>{`NE`}</button>
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

export default function LanguageWrappedApp() {
  return(
    <LanguageProvider>
      <App />
    </LanguageProvider>
  )
};
