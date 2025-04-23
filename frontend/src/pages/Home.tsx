import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Link,
  Toolbar,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const Home: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#6C63FF' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SecureBank
          </Typography>
          <Button color="inherit" component={RouterLink} to="/login">Login</Button>
          <Button color="inherit" component={RouterLink} to="/register">Sign Up</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h2" component="h1" gutterBottom>
              Where Money
            </Typography>
            <Typography variant="h2" component="h1" gutterBottom color="primary">
              Meet Trust.
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Secure and reliable banking solutions for all your financial needs. Join thousands of satisfied customers who trust us with their finances.
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to="/register"
              sx={{ mt: 2 }}
            >
              Know More
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: 8 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <AccountBalanceIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                  Savings Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Grow your savings with competitive interest rates and secure banking.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <BusinessIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                  Business Loans
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Flexible business loans to help your business grow and succeed.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <CreditCardIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                  Debit & Credit Card
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Convenient and secure payment options for all your needs.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 