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
import { useEffect, useState } from 'react';
import UserProfile from './pages/profile_management/UserProfile';
import ChildrenManagement from './pages/children_management/ChildrenManagement';
import VehicleManagement from './pages/vehicle_management/VehicleManagement';
import ChangePassword from './pages/profile_management/ChangePassword';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { changeLanguage } = useLanguage();
  const token = sessionStorage.getItem("token");
 
  useEffect(() => {
    if(!!token){
      setIsLoggedIn(true);
    }else{
      setIsLoggedIn(false);
    }
  }, [token]);

  return (
    <main>
      <Router>
        {!token ? ( 
          <div className="flex justify-end p-4">
            <LanguageSelect changeLanguage={changeLanguage} />
          </div>
        ):(
          <Header changeLanguage={changeLanguage} setIsLoggedIn={setIsLoggedIn} />
        )}
        <Routes>
          <Route path="/" element={<AuthPage isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<LoginPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>} />
          <Route path="/signup/*" element={<SignUpPage isLoggedIn={isLoggedIn}/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my_children" element={<ChildrenManagement isLoggedIn={isLoggedIn} />} />
          <Route path="/my_vehicles" element={<VehicleManagement isLoggedIn={isLoggedIn} />} />
          <Route path="/profile/change-password" element={<ChangePassword isLoggedIn={isLoggedIn} />} />
          <Route path="/profile" element={<UserProfile isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
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
