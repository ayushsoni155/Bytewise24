import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Badge,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggleButton from './ThemeToggleButton';
import ProfilePopup from './ProfilePopup';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Notes', path: '/notes' },
  { label: 'Videos', path: '/videos' },
  { label: 'Lab Manuals', path: '/lab-manuals' },
  { label: 'Courses', path: '/courses' },
];

export default function Navbar({ cartCount = 0 }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const {loadCart} = useCart();
  const { isLoggedIn } = useAuth();

  const isDark = theme.palette.mode === 'dark';
  const bgColor = isDark ? '#1e1e1e' : '#ffffff';
  const hoverColor = isDark ? '#333' : '#f0f0f0';
  const textColor = isDark ? '#ffffff' : '#000000';

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const drawerContent = (
    <Box
      sx={{
        width: 260,
        height: '100%',
        bgcolor: bgColor,
        color: textColor,
        px: 2,
        pt: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        ByteWise
      </Typography>
      <Typography variant="body2" sx={{ color: 'gray', mb: 2 }}>
        Tool kit for engineering success
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.label}
            component={Link}
            to={item.path}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&:hover': { backgroundColor: hoverColor },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}

        {!isLoggedIn && (
          <>
            <ListItemButton
              component={Link}
              to="/login"
              sx={{
                borderRadius: 2,
                mb: 1,
                '&:hover': { backgroundColor: hoverColor },
              }}
            >
              <ListItemText primary="Login" />
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="/signup"
              sx={{
                borderRadius: 2,
                '&:hover': { backgroundColor: hoverColor },
              }}
            >
              <ListItemText primary="Signup" />
            </ListItemButton>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={3}
        sx={{
          background: bgColor,
          color: textColor,
          px: { xs: 1, sm: 2 },
          py: 0.5,
          boxShadow: isDark ? '0 0 10px #111' : '0 0 10px #ccc',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {/* Left Section */}
          <Box display="flex" alignItems="center" gap={2}>
            {isMobile && (
              <IconButton edge="start" onClick={toggleDrawer(true)} sx={{ color: 'inherit' }}>
                <MenuIcon />
              </IconButton>
            )}
            <Box>
              <Typography
                variant="h5"
                component={Link}
                to="/"
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  fontWeight: 600,
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                ByteWise
              </Typography>
              {!isMobile && (
                <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'gray' }}>
                  Tool kit for engineering success
                </Typography>
              )}
            </Box>
          </Box>

          {/* Center Nav Links (Desktop only) */}
          {!isMobile && (
            <Box display="flex" gap={2} alignItems="center">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: 'inherit',
                    fontWeight: 500,
                    borderRadius: '12px',
                    transition: '0.3s',
                    '&:hover': {
                      backgroundColor: hoverColor,
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Right Section */}
          <Box display="flex" alignItems="center" gap={1.5}>
            <ThemeToggleButton />

            {isLoggedIn && (
              <IconButton onClick={() => setShowProfile(!showProfile)} sx={{ color: 'inherit' }}>
                <AccountCircleIcon />
              </IconButton>
            )}

            {!isLoggedIn && !isMobile && (
              <>
                <Button component={Link} to="/login" color="inherit" sx={{ fontWeight: 500 }}>
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="outlined"
                  sx={{
                    borderColor: textColor,
                    color: 'inherit',
                    fontWeight: 500,
                    '&:hover': { backgroundColor: hoverColor },
                  }}
                >
                  Signup
                </Button>
              </>
            )}

           <IconButton onClick={loadCart} component={Link} to="/cart" sx={{ color: 'inherit' }}>
  <Badge badgeContent={cartCount} color="error">
    <ShoppingCartIcon />
  </Badge>
</IconButton>

          </Box>
        </Toolbar>

        {/* Profile Popup */}
        {showProfile && (
          <Box
            sx={{
              position: 'absolute',
              top: '70px',
              right: '30px',
              zIndex: 1500,
            }}
          >
            <ProfilePopup onClose={() => setShowProfile(false)} />
          </Box>
        )}
      </AppBar>

      {/* Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
}
