import './App.css';
// import ParentProfile from './pages/ParentProfile'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from './pages/auth/Auth';
import SignUpPage from './pages/auth/Signup';
import LoginPage from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import LanguageSelect from './components/common/LanguageSelect';
import Header from './components/layout/Header';

function App() {

  const { changeLanguage } = useLanguage();
  const token = sessionStorage.getItem("token");

  return (
    <main>
      {!token ? ( 
        <div className="flex justify-end p-4">
          <LanguageSelect changeLanguage={changeLanguage} />
        </div>
      ):(
        <Header changeLanguage={changeLanguage} />
      )}
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup/*" element={<SignUpPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/children" element={<Dashboard />} />
          <Route path="/dashboard/vehicles" element={<Dashboard />} />
          <Route path="/dashboard/profile" element={<Dashboard />} />
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
