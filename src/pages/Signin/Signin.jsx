import React, { useContext, useState } from "react";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';
import Copyright from "../../components/Copyright/Copyright";
import AppleLogin from "react-apple-login";
import axios from "axios";

export const Signin = ({ Context }) => {
    
    const [accessToken, setAccessToken] = useState(null);

  // Google Login Success
  const responseGoogle = async (response) => {
    try {
      const res = await fetch("http://localhost:8000/api/google_login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: response.accessToken,
        }),
      });

      const data = await res.json();
      console.log(data);
      setAccessToken(data.access_token);
    } catch (err) {
      console.log(err);
    }
  };

  // Google Login Error
  const responseGoogleError = (error) => {
    console.log(error);
  };

  // Facebook Login Success
    const responseFacebook = async (response) => {
        try {
            const res = await fetch("http://localhost:8000/api/facebook_login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    access_token: response.accessToken,
                }),
            });

            const data = await res.json();
            console.log(data);
            setAccessToken(data.access_token);
        } catch (err) {
            console.log(err);
        };
    }
    // Facebook Login Error
  const responseFacebookError = (error) => {
    console.log(error);
    };
    // Apple Login Success
  const responseApple = async (response) => {
    try {
      const res = await axios.post("http://localhost:8000/rest-auth/apple_login/", {
        id_token: response.authorization.id_token,
      });

      const data = res.data;
      console.log(data);
      setAccessToken(data.access_token);
    } catch (err) {
      console.log(err);
    }
  };

  // Apple Login Error
  const responseAppleError = (error) => {
    console.log(error);
  };

      

    const { fetchToken } = useContext(Context);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const data = new FormData(event.currentTarget);
            const username = data.get('username')
            const password = data.get('password')

            const loginUser = await fetchToken(username, password)
            loginUser == 200 ? navigate("/") : console.log("User with provided details does not exist")
        }
        catch(error) {
            console.log(error)
        }
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
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            autoComplete="username"
                            name="username"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>

                        <div>
      <GoogleLogin
        clientId="500430174142-l81aj9joeiookg94buo9jq0j7il8t2o3.apps.googleusercontent.com"
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogleError}
        cookiePolicy={"single_host_origin"}
      />

      <FacebookLogin
        appId="225440500220299"
        fields="name,email,picture"
        callback={responseFacebook}
        onFailure={responseFacebookError}
                            />
                            
    <AppleLogin
        clientId="UN2XK86RAV"
        redirectURI="your-redirect-uri"
        onSuccess={responseApple}
        onError={responseAppleError}
        responseType="code id_token"
      />

      {accessToken && <p>Access Token: {accessToken}</p>}
    </div>

                                        
                        <Grid container>
                            <Grid item xs>
                                <Link to={""} variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link component={ReactRouterLink} to="/signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </div>
    )
}

export default Signin;