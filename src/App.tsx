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

function App() {

  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(false);
  const { changeLanguage } = useLanguage();
  const { isLoggedIn, isAdmin, logout } = useUser();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if(!token){
      logout();
    }
  }, [token, logout]);

  return (
    <main>
      <Router>
        {!token ? ( 
          <div className="flex justify-end p-4">
            <LanguageSelect changeLanguage={changeLanguage} />
          </div>
        ):(
          <Header changeLanguage={changeLanguage} logout={logout} isAdmin={isAdmin} />
        )}
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup/*" element={<SignUpPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-children/edit-child-data/:id" element={<EditChildData isLoggedIn={isLoggedIn} />} /> 
          <Route path="/my-children/add-child-data" element={<AddChildData isLoggedIn={isLoggedIn} />} />
          <Route path="/my-children" element={<ChildrenManagement isLoggedIn={isLoggedIn} />} />
          <Route path="/my-vehicles/edit-vehicle-data/:id" element={<EditVehicleData isLoggedIn={isLoggedIn} />} /> 
          <Route path="/my-vehicles/add-vehicle-data" element={<AddVehicleData isLoggedIn={isLoggedIn} />} />
          <Route path="/my-vehicles" element={<VehicleManagement isLoggedIn={isLoggedIn} />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/school-carpool" element={<SchoolManagement />} />
          <Route path="user-management" element={<UserManagement />} />
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
