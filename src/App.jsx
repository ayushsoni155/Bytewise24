import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Notes from './pages/Notes';
import Videos from './pages/Videos';
import { useAuth } from './context/AuthContext'; 
import { CircularProgress, Box } from '@mui/material';
import LabManuals from './pages/LabManuals';
import Cart from './pages/Cart';
import { useCart } from './context/CartContext';
import Courses from './pages/Courses';
import Footer from './components/Footer';
import Error404Page from './pages/Error404Page';
import './App.css';
import ForgotPassword from './pages/ForgotPassword';
import LandingPage from './pages/LandingPage';
import Orders from './pages/Orders';

function App() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const { loading } = useAuth();

  if (loading) {
    return (
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar cartCount={cartCount} />
      
      {/* Main Content */}
      <Box flexGrow={1}>
        <Routes>
          
          <Route path="/" element={<LandingPage/>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/lab-manuals" element={<LabManuals />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/orders" element={<Orders/>} />

          <Route path="*" element={<Error404Page/>} />

        </Routes>
      </Box>

      <Footer />
    </Box>
  );
}

export default App;
