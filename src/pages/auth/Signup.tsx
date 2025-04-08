import { Routes, Route } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import SignupStep1 from "./signup/SignupStep1";
import SignupStep2 from "./signup/SignupStep2";
import SignupStep3 from "./signup/SignupStep3";
import SignupSuccess from "./signup/SignupSuccess";
import AuthPage from "./Auth";


export default function SignUpPage () {
  return (

      <Routes>
        <Route path="/1" element={<AuthLayout><SignupStep1 /></AuthLayout>} />
        <Route path="/2" element={<AuthLayout><SignupStep2 /></AuthLayout>} />
        <Route path="/3" element={<AuthLayout><SignupStep3 /></AuthLayout>} />
        <Route path="/complete" element={<SignupSuccess />} />
        <Route path="/" element={<AuthPage />} />
      </Routes>

  );
}

