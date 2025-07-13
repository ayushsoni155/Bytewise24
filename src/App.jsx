import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Notes from './pages/Notes';
import Videos from './pages/Videos';
import { useAuth } from './context/AuthContext';
import { Skeleton, Box, Container, Grid, Paper } from '@mui/material';
import LabManuals from './pages/LabManuals';
import Cart from './pages/Cart';
import { useCart } from './context/CartContext';
import Courses from './pages/Courses';
import Footer from './components/Footer';
import Error404Page from './pages/Error404Page';
import ForgotPassword from './pages/ForgotPassword';
import LandingPage from './pages/LandingPage';
import Orders from './pages/Orders';
function App() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const { loading, isLoggedIn } = useAuth();

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        {/* Simulate navbar */}
        <Box sx={{ px: 2, py: 2, bgcolor: 'background.paper' }}>
          <Skeleton variant="rectangular" height={50} />
        </Box>

        {/* Main content loader */}
        <Box flexGrow={1} sx={{ p: 3 }}>
          <Container maxWidth="md">
            <Grid container spacing={3}>
              {[...Array(4)].map((_, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Skeleton variant="rounded" height={150} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Footer loader */}
        <Box sx={{ bgcolor: 'background.paper', py: 2 }}>
          <Skeleton variant="text" width="50%" height={30} sx={{ mx: 'auto' }} />
          <Skeleton variant="text" width="30%" height={20} sx={{ mx: 'auto' }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar cartCount={cartCount} />
      <Box flexGrow={1}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <Signup />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />

          <Route path="/notes" element={<Notes />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/lab-manuals" element={<LabManuals />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/courses" element={<Courses />} />
            <Route path="/orders" element={isLoggedIn ? <Orders />:<Navigate to="/login" />} />
          <Route path="*" element={<Error404Page />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
