import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  IconButton,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import Navbar from '../components/Navbar';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = {
    totalBalance: 30001.25,
    activeLoans: {
      count: 1,
      amount: 10000.00
    },
    monthlySavings: 52.08,
    securityAlerts: 1
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Total Balance */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccountBalanceIcon color="primary" />
                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                  Total Balance
                </Typography>
              </Box>
              <Typography variant="h4" component="div">
                ${stats.totalBalance.toFixed(2)}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                ↑ 2.5% from last month
              </Typography>
            </Paper>
          </Grid>

          {/* Active Loans */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MonetizationOnIcon color="primary" />
                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                  Active Loans
                </Typography>
              </Box>
              <Typography variant="h4" component="div">
                ${stats.activeLoans.amount.toFixed(2)}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {stats.activeLoans.count} active loans
              </Typography>
            </Paper>
          </Grid>

          {/* Monthly Savings */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon color="primary" />
                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                  Monthly Savings
                </Typography>
              </Box>
              <Typography variant="h4" component="div">
                ${stats.monthlySavings.toFixed(2)}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Interest earned this month
              </Typography>
            </Paper>
          </Grid>

          {/* Security Status */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SecurityIcon color="primary" />
                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                  Security Status
                </Typography>
              </Box>
              <Typography variant="h4" component="div">
                {stats.securityAlerts} Alerts
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {stats.securityAlerts} high priority
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard; 