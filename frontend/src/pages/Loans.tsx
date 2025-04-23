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
  LinearProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Navbar from '../components/Navbar';

interface Loan {
  id: number;
  amount: number;
  termMonths: number;
  interestRate: number;
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'REJECTED' | 'DEFAULTED';
  startDate: string | null;
  nextPaymentDate: string | null;
  monthlyPayment: number;
  totalInterest: number;
  remainingPayments: number;
  createdAt: string;
}

interface LoanFormData {
  amount: string;
  termMonths: string;
  purpose: string;
  employmentStatus: string;
  monthlyIncome: string;
  collateral: string;
}

const Loans: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openLoanForm, setOpenLoanForm] = useState(false);
  const [formData, setFormData] = useState<LoanFormData>({
    amount: '',
    termMonths: '',
    purpose: '',
    employmentStatus: '',
    monthlyIncome: '',
    collateral: '',
  });

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:8080/api/loans', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch loans');
      }

      const data = await response.json();
      setLoans(data);
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

  const handleMakePayment = async (loanId: number) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:8080/api/loans/${loanId}/payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to make payment');
      }

      // Refresh loans list after successful payment
      await fetchLoans();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleApplyLoan = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:8080/api/loans/apply', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          termMonths: parseInt(formData.termMonths),
          purpose: formData.purpose,
          employmentStatus: formData.employmentStatus,
          monthlyIncome: parseFloat(formData.monthlyIncome),
          collateral: formData.collateral,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to apply for loan');
      }

      setOpenLoanForm(false);
      setFormData({
        amount: '',
        termMonths: '',
        purpose: '',
        employmentStatus: '',
        monthlyIncome: '',
        collateral: '',
      });
      await fetchLoans();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
      case 'DEFAULTED':
        return 'error';
      case 'ACTIVE':
        return 'success';
      default:
        return 'info';
    }
  };

  const calculateProgress = (loan: Loan) => {
    if (loan.termMonths === 0) return 0;
    const completedPayments = loan.termMonths - loan.remainingPayments;
    return (completedPayments / loan.termMonths) * 100;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Loans
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenLoanForm(true)}
          >
            + Apply for Loan
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <LinearProgress />
          </Box>
        ) : loans.length === 0 ? (
          <Alert severity="info">No loans found. Apply for your first loan!</Alert>
        ) : (
          <Grid container spacing={3}>
            {loans.map((loan) => (
              <Grid item xs={12} key={loan.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" component="div">
                          ${loan.amount.toFixed(2)}
                          <Typography
                            variant="caption"
                            sx={{
                              ml: 1,
                              px: 1,
                              py: 0.5,
                              bgcolor: `${getStatusColor(loan.status)}.light`,
                              color: `${getStatusColor(loan.status)}.dark`,
                              borderRadius: 1
                            }}
                          >
                            {loan.status}
                          </Typography>
                        </Typography>
                        <Typography color="text.secondary">
                          {loan.purpose}
                        </Typography>
                      </Box>
                      {(loan.status === 'APPROVED' || loan.status === 'ACTIVE') && (
                        <Button 
                          variant="contained"
                          onClick={() => handleMakePayment(loan.id)}
                          sx={{ mt: 2 }}
                        >
                          MAKE PAYMENT
                        </Button>
                      )}
                    </Box>

                    {(loan.status === 'APPROVED' || loan.status === 'ACTIVE') && (
                      <Box sx={{ mb: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={calculateProgress(loan)}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {calculateProgress(loan).toFixed(2)}% Complete
                        </Typography>
                      </Box>
                    )}

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Term Length
                        </Typography>
                        <Typography variant="h6">
                          {loan.termMonths} months
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Interest Rate: {loan.interestRate}%
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Monthly Payment
                        </Typography>
                        <Typography variant="h6">
                          ${loan.monthlyPayment.toFixed(2)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Next Due: {loan.nextPaymentDate ? new Date(loan.nextPaymentDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Remaining Payments
                        </Typography>
                        <Typography variant="h6">
                          {loan.remainingPayments}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Interest
                        </Typography>
                        <Typography variant="h6">
                          ${loan.totalInterest.toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* New Loan Application Dialog */}
        <Dialog open={openLoanForm} onClose={() => setOpenLoanForm(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Loan Application</DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              fullWidth
              label="Loan Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Term (Months)"
              name="termMonths"
              type="number"
              value={formData.termMonths}
              onChange={(e) => setFormData({ ...formData, termMonths: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Purpose"
              name="purpose"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Employment Status</InputLabel>
              <Select
                name="employmentStatus"
                value={formData.employmentStatus}
                label="Employment Status"
                onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
              >
                <MenuItem value="employed">Employed</MenuItem>
                <MenuItem value="self-employed">Self Employed</MenuItem>
                <MenuItem value="business-owner">Business Owner</MenuItem>
                <MenuItem value="retired">Retired</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              fullWidth
              label="Monthly Income"
              name="monthlyIncome"
              type="number"
              value={formData.monthlyIncome}
              onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Collateral Details"
              name="collateral"
              multiline
              rows={3}
              value={formData.collateral}
              onChange={(e) => setFormData({ ...formData, collateral: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenLoanForm(false)}>Cancel</Button>
            <Button onClick={handleApplyLoan} variant="contained">Submit Application</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Loans; 