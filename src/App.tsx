import './App.css';
import "./leaflet-config";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from './pages/auth/Auth';
import SignUpPage from './pages/auth/Signup';
import LoginPage from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import LanguageSelect from './components/common/LanguageSelect';
import Header from './components/layout/Header';
import { useEffect } from 'react';
import UserProfile from './pages/profile_management/UserProfile';
import ChildrenManagement from './pages/children_management/ChildrenManagement';
import VehicleManagement from './pages/vehicle_management/VehicleManagement';
import ChangePassword from './pages/profile_management/ChangePassword';
import AddChildData from './pages/children_management/AddChildData';
import EditChildData from './pages/children_management/EditChildData';
import AddVehicleData from './pages/vehicle_management/AddVehicleData';
import EditVehicleData from './pages/vehicle_management/EditVehicleData';
import SchoolManagement from './pages/admin/SchoolManagement';
import UserManagement from './pages/admin/UserManagement'
import { useUser, UserProvider } from './context/UserContext';
import ProfileManagement from './pages/admin/ProfileManagement';
import { DarkModeProvider } from './context/DarkModeContext';
import DarkModeToggle from './components/common/DarkModeToggle';
import CarpoolSearch from './pages/carpool/CarpoolSearch';
import CarpoolApply from './pages/carpool/CarpoolApply';
import CarpoolManagement from './pages/carpool/CarpoolManagement';

function App() {

  const { changeLanguage } = useLanguage();
  const { isAdmin, logout } = useUser();
  const token: string | null = sessionStorage.getItem("token");

  useEffect(() => {
    if(!token){
      logout();
    }
  }, [token, logout]);

  return (
    <main className="min-h-screen bg-white dark:bg-[#2C3E50] text-black dark:text-white">
      <Router>
        {!token ? ( 
          <div className="flex justify-end p-4">
            <LanguageSelect changeLanguage={changeLanguage} />
            <DarkModeToggle />
          </div>
        ):(
          <Header changeLanguage={changeLanguage} logout={logout} isAdmin={isAdmin} />
        )}
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup/*" element={<SignUpPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-children/edit-child-data/:id" element={<EditChildData />} /> 
          <Route path="/my-children/add-child-data" element={<AddChildData />} />
          <Route path="/my-children" element={<ChildrenManagement />} />
          <Route path="/my-vehicles/edit-vehicle-data/:id" element={<EditVehicleData />} /> 
          <Route path="/my-vehicles/add-vehicle-data" element={<AddVehicleData />} />
          <Route path="/my-vehicles" element={<VehicleManagement />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/school-carpool" element={<SchoolManagement />} />
          <Route path="/carpool-apply/:id" element={<CarpoolApply />} />
          <Route path="/carpool-management" element={<CarpoolManagement />} />
          <Route path="/carpool-search" element={<CarpoolSearch />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/user/:id" element={<ProfileManagement />} />
        </Routes>
      </Router>
    </main>
  );
}

export default function LanguageWrappedApp() {
  return(
    <LanguageProvider>
      <UserProvider>
        <DarkModeProvider>
          <App />
        </DarkModeProvider>
      </UserProvider>
    </LanguageProvider>
  )
};
