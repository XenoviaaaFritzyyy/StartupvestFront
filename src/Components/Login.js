import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Grid, Typography, TextField, Button, Link, Paper, IconButton, InputAdornment, Snackbar, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import styles from '../styles/Login';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, {
            email,
            password,
        });

        // Check if the response contains the necessary data
        if (response.data && response.data.jwt) {
            localStorage.setItem('token', response.data.jwt);
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('role', response.data.role); // Store the role from the response

            console.log('Login successful:', response.data);
            setLoggedIn(true);
            setOpenAlert(true);

            setTimeout(() => {
                if (response.data.role === 'admin') {
                    navigate('/admindashboard');
                } else {
                    navigate('/asCompanyOwnerOverview');
                }
            }, 1000);
        } else {
            throw new Error('Invalid login response');
        }
    } catch (error) {
        console.error('Login failed:', error);
        setError('Incorrect email or password');
    }
};


  const isEmailRegistered = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/check-email`, {
        email,
      });
      setEmailExists(response.data.exists);
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <Container sx={styles.container}>
      <Grid container justifyContent="center">
        {/* LEFT SIDE (only show on large screens) */}
        <Grid item xs={12} lg={6} display={{ xs: 'none', lg: 'block' }} textAlign="center">
          <Paper elevation={3} sx={styles.paperLeft}>
            <Typography variant='h4' sx={styles.welcomeText}>
              Welcome back! <br />
              Excited to have you again. <br />
              Sign in to get back on track!
            </Typography>

            <Typography variant='h6' sx={styles.subtitleText}>
              "Empowering Startups, Tracking Investments"
            </Typography>
            <img src="images/picture.jpg" alt="Startup Vest Logo" style={styles.logoImage} />
          </Paper>
        </Grid>

        {/* LOGIN FORM */}
        <Grid item xs={12} md={8} lg={5} paddingX={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <img src="images/logo.png" alt="Logo" style={{ width: '70%', marginBottom: '10px', maxWidth: '100%' }} />
          <Paper elevation={3} style={styles.formContainer}>
            <form onSubmit={handleSubmit} sx={styles.form}>
              <Typography variant="h5" sx={styles.signInText}>
                Sign In
              </Typography>

              {error && (
                <Typography variant="body2" color="error" sx={styles.errorText}>
                  {error}
                </Typography>
              )}

              <Typography sx={styles.emailLabel}>Email</Typography>
              <TextField
                type="text"
                placeholder="johndoe@gmail.com"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailExists(false);
                  setError('');
                }}
                onBlur={isEmailRegistered}
                fullWidth
                margin="normal"
                sx={styles.textField}/>

              <Typography sx={styles.passwordLabel}>Password</Typography>
              <TextField
                type={showPassword ? 'text' : 'password'}
                placeholder="Example123"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                fullWidth
                margin="normal"
                sx={styles.passwordField}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        size="small">
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}/>

              <Button type="submit" variant="contained" color="primary" sx={styles.signInButton}>
                Sign In
              </Button>

              <div style={{ marginTop: '16px' }}>
                <Typography variant="body2" sx={styles.signUpLink}>
                  Don't have an account?{' '}
                  <Link component={RouterLink} to="/signup" sx={styles.signUpLink}>
                    Sign Up
                  </Link>
                </Typography>
              </div>
            </form>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleCloseAlert} 
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseAlert} severity="success" sx={styles.snackbar}>
          Login successful! Redirecting to homepage...
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Login;
