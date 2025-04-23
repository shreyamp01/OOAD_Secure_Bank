import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from '../components/Navbar';

interface Account {
  id: number;
  accountNumber: string;
  accountType: 'SAVINGS' | 'CHECKING';
  balance: number;
  interestRate: number;
  purpose: string;
  createdAt: string;
}

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    accountType: 'SAVINGS',
    initialDeposit: '',
    purpose: '',
  });

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:8080/api/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }

      const data = await response.json();
      setAccounts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreateAccount = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:8080/api/accounts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountType: newAccount.accountType,
          initialDeposit: parseFloat(newAccount.initialDeposit),
          purpose: newAccount.purpose,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create account');
      }

      setOpen(false);
      setNewAccount({
        accountType: 'SAVINGS',
        initialDeposit: '',
        purpose: '',
      });
      await fetchAccounts();
    } catch (error) {
      console.error('Error creating account:', error);
      setError(error instanceof Error ? error.message : 'Failed to create account');
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Your Accounts
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
          >
            + New Account
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : accounts.length === 0 ? (
          <Alert severity="info">No accounts found. Create your first account!</Alert>
        ) : (
          <Grid container spacing={3}>
            {accounts.map((account) => (
              <Grid item xs={12} md={6} key={account.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" component="div">
                          {account.accountType} Account
                        </Typography>
                        <Typography color="text.secondary">
                          {account.accountNumber}
                        </Typography>
                      </Box>
                      <Box>
                        <Button
                          startIcon={<SwapHorizIcon />}
                          sx={{ mr: 1 }}
                        >
                          Transfer
                        </Button>
                        <Button
                          color="error"
                          startIcon={<DeleteIcon />}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>

                    <Typography variant="h4" component="div" gutterBottom>
                      ${account.balance.toFixed(2)}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      Purpose: {account.purpose}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Create New Account</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Account Type</InputLabel>
              <Select
                value={newAccount.accountType}
                label="Account Type"
                onChange={(e) => setNewAccount({ ...newAccount, accountType: e.target.value })}
              >
                <MenuItem value="SAVINGS">Savings</MenuItem>
                <MenuItem value="CHECKING">Checking</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Initial Deposit"
              type="number"
              value={newAccount.initialDeposit}
              onChange={(e) => setNewAccount({ ...newAccount, initialDeposit: e.target.value })}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Purpose"
              value={newAccount.purpose}
              onChange={(e) => setNewAccount({ ...newAccount, purpose: e.target.value })}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>CANCEL</Button>
            <Button 
              onClick={handleCreateAccount} 
              variant="contained"
              disabled={!newAccount.initialDeposit || !newAccount.purpose}
            >
              CREATE
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Accounts; 