import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Avatar,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#6C63FF' }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          component={RouterLink}
          to="/dashboard"
          sx={{ mr: 2 }}
        >
          <AccountBalanceIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          SecureBank
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/accounts">
            Accounts
          </Button>
          <Button color="inherit" component={RouterLink} to="/transactions">
            Transactions
          </Button>
          <Button color="inherit" component={RouterLink} to="/loans">
            Loans
          </Button>
          <Button color="inherit" component={RouterLink} to="/security">
            Security
          </Button>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            <AccountCircleIcon />
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 