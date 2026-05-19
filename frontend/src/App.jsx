import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import AuthPage from './components/AuthPage';
import UserLogin from './pages/Userlogin';
import UserSignup from './pages/Usersignup';
import CaptainLogin from './pages/Captainlogin';
import CaptainSignup from './pages/Captainsignup';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<AuthPage defaultRole="user" defaultMode="signup" />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/captain/login" element={<CaptainLogin />} />
      <Route path="/captain/signup" element={<CaptainSignup />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;