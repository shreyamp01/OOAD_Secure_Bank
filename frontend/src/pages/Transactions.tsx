import React, { useState, ChangeEvent, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Grid,
  SelectChangeEvent,
} from '@mui/material';
import Navbar from '../components/Navbar';

interface Transaction {
  id: number;
  accountNumber: string;
  description: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  category: 'INCOME' | 'CASH' | 'TRANSFER' | 'LOAN_PAYMENT' | 'OTHER';
  referenceNumber: string;
  location: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
}

const Transactions: React.FC = () => {
  const [openNewTransaction, setOpenNewTransaction] = useState(false);
  const [transactionType, setTransactionType] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:8080/api/transactions/account/1', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewTransaction = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:8080/api/transactions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: 1,
          amount: parseFloat(amount),
          description,
          type: transactionType.toUpperCase(),
          category: category.toUpperCase(),
          location: 'Online',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create transaction');
      }

      setOpenNewTransaction(false);
      setTransactionType('');
      setAmount('');
      setDescription('');
      setCategory('');
      await fetchTransactions();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Recent Transactions
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenNewTransaction(true)}
          >
            + New Transaction
          </Button>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select defaultValue="all" label="Type">
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="deposit">Deposit</MenuItem>
                <MenuItem value="withdrawal">Withdrawal</MenuItem>
                <MenuItem value="transfer">Transfer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Time Period</InputLabel>
              <Select defaultValue="7days" label="Time Period">
                <MenuItem value="7days">Last 7 Days</MenuItem>
                <MenuItem value="30days">Last 30 Days</MenuItem>
                <MenuItem value="90days">Last 90 Days</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Min Amount"
              type="number"
              placeholder="0.00"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Max Amount"
              type="number"
              placeholder="0.00"
            />
          </Grid>
        </Grid>

        {/* Transactions Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    {transaction.description}
                    <Typography variant="caption" display="block" color="text.secondary">
                      Ref: {transaction.referenceNumber}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{transaction.category}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: 
                          transaction.type === 'DEPOSIT' ? 'success.light' :
                          transaction.type === 'WITHDRAWAL' ? 'error.light' : 'info.light',
                        color: 
                          transaction.type === 'DEPOSIT' ? 'success.dark' :
                          transaction.type === 'WITHDRAWAL' ? 'error.dark' : 'info.dark',
                      }}
                    >
                      {transaction.type}
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{
                    color: 
                      transaction.type === 'DEPOSIT' ? 'success.main' :
                      transaction.type === 'WITHDRAWAL' ? 'error.main' : 'inherit'
                  }}>
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: 'success.light',
                        color: 'success.dark',
                      }}
                    >
                      {transaction.status}
                    </Box>
                  </TableCell>
                  <TableCell>{transaction.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* New Transaction Dialog */}
        <Dialog open={openNewTransaction} onClose={() => setOpenNewTransaction(false)}>
          <DialogTitle>New Transaction</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Transaction Type</InputLabel>
              <Select
                value={transactionType}
                label="Transaction Type"
                onChange={(e: SelectChangeEvent) => setTransactionType(e.target.value)}
              >
                <MenuItem value="deposit">Deposit</MenuItem>
                <MenuItem value="withdrawal">Withdrawal</MenuItem>
                <MenuItem value="transfer">Transfer</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              fullWidth
              label="Amount"
              type="number"
              value={amount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Description"
              value={description}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e: SelectChangeEvent) => setCategory(e.target.value)}
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="transfer">Transfer</MenuItem>
                <MenuItem value="loan_payment">Loan Payment</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenNewTransaction(false)}>Cancel</Button>
            <Button onClick={handleNewTransaction} variant="contained">Create Transaction</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Transactions;
