import './App.css';
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
import { UserProvider, useUser } from './context/UserContext';

function App() {

  const { changeLanguage } = useLanguage();
  const token = sessionStorage.getItem("token");
  const { logout } = useUser();
 
  useEffect(() => {
    if(!token){
      logout();
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
          <Header changeLanguage={changeLanguage} />
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
        </Routes>
      </Router>
    </main>
  );
}

export default function LanguageWrappedApp() {
  return(
    <LanguageProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </LanguageProvider>
  )
};
