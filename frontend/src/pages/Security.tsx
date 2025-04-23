import React, { useState, ChangeEvent } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';
import Navbar from '../components/Navbar';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Security: React.FC = () => {
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const securitySettings = {
    twoFactorAuth: true,
    loginNotifications: true,
    transactionAlerts: true,
    deviceVerification: true,
  };

  const recentActivity = [
    {
      id: 1,
      type: 'Login',
      device: 'Windows PC - Chrome',
      location: 'New York, USA',
      time: '2024-03-15T16:00:00',
      status: 'Success'
    },
    {
      id: 2,
      type: 'Password Change',
      device: 'Windows PC - Chrome',
      location: 'New York, USA',
      time: '2024-03-14T14:30:00',
      status: 'Success'
    },
    {
      id: 3,
      type: 'Failed Login',
      device: 'Unknown Device',
      location: 'London, UK',
      time: '2024-03-14T10:15:00',
      status: 'Failed'
    }
  ];

  const handlePasswordChange = () => {
    // TODO: Implement password change
    setOpenChangePassword(false);
  };

  const handleSettingToggle = (setting: keyof typeof securitySettings) => {
    // TODO: Implement settings toggle
    console.log(`Toggle ${setting}`);
  };

  const handlePasswordFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Security Settings
        </Typography>

        <Grid container spacing={3}>
          {/* Security Options */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Account Security
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <LockIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Password" 
                      secondary="Last changed 2 days ago"
                    />
                    <ListItemSecondaryAction>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => setOpenChangePassword(true)}
                      >
                        Change
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Two-Factor Authentication" 
                      secondary="Using SMS verification"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={securitySettings.twoFactorAuth}
                        onChange={() => handleSettingToggle('twoFactorAuth')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Login Notifications" 
                      secondary="Email alerts for new device logins"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={securitySettings.loginNotifications}
                        onChange={() => handleSettingToggle('loginNotifications')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <NotificationsIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Transaction Alerts" 
                      secondary="SMS and email notifications"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={securitySettings.transactionAlerts}
                        onChange={() => handleSettingToggle('transactionAlerts')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <SecurityIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Device Verification" 
                      secondary="Verify new devices before login"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={securitySettings.deviceVerification}
                        onChange={() => handleSettingToggle('deviceVerification')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Security Activity
                </Typography>
                <List>
                  {recentActivity.map((activity) => (
                    <React.Fragment key={activity.id}>
                      <ListItem>
                        <ListItemIcon>
                          {activity.status === 'Failed' ? (
                            <WarningIcon color="error" />
                          ) : (
                            <SecurityIcon color="success" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.type}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.secondary">
                                {activity.device} • {activity.location}
                              </Typography>
                              <br />
                              <Typography component="span" variant="body2" color="text.secondary">
                                {new Date(activity.time).toLocaleString()}
                              </Typography>
                            </>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Typography
                            variant="caption"
                            sx={{
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: activity.status === 'Success' ? 'success.light' : 'error.light',
                              color: activity.status === 'Success' ? 'success.dark' : 'error.dark',
                            }}
                          >
                            {activity.status}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Change Password Dialog */}
        <Dialog open={openChangePassword} onClose={() => setOpenChangePassword(false)}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              fullWidth
              label="Current Password"
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordFormChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordFormChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordFormChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenChangePassword(false)}>Cancel</Button>
            <Button onClick={handlePasswordChange} variant="contained">Change Password</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Security; 