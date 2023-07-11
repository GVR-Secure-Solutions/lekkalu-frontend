import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link as ReactRouterLink } from 'react-router-dom';
import Copyright from '../../components/Copyright/Copyright';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useSignUp } from '../../utils/hooks/useSignUpUser';

export const Signup = () => {
  const [acceptedTerms, setAcceptedTerms] = useState();
  const [acceptedPrivacyPolicy, setAcceptPrivacyPolicy] = useState();
  const { handleSubmit: handleSignUpSubmit } = useSignUp();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(acceptedTerms, acceptedPrivacyPolicy);
    const data = new FormData(event.currentTarget);
    console.log(data.get('termsAndConditions'));

    const registeredData = JSON.stringify({
      username: data.get('username'),
      email: data.get('email'),
      password: data.get('password'),
    });

    console.log('registered data', registeredData);
    handleSignUpSubmit(registeredData);
  };

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h4">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="username"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  data-testid='usernameSignup'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  data-testid='emailSignup'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  data-testid='passwordSignup'
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  required
                  name="termsAndConditions"
                  control={
                    <Checkbox
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      color="success"
                      data-testid='checkTermSignup'
                    />
                  }
                  label={
                    "I have read, understood and agreed to EMI Calculator's Terms and Conditions"
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  required
                  name="privacyPolicy"
                  control={
                    <Checkbox
                      onChange={(e) => setAcceptPrivacyPolicy(e.target.checked)}
                      color="success"
                      data-testid='checkPrivacySignup'
                    />
                  }
                  label={
                    "I have read, understood and agreed to EMI Calculator's Privacy Policy"
                  }
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!acceptedTerms || !acceptedPrivacyPolicy}
              data-testid="buttonSignup"
            >
              Sign Up
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link component={ReactRouterLink} to="/signin" variant="body2">
                  {'Already have an account? Sign in'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </div>
  );
};

export default Signup;
