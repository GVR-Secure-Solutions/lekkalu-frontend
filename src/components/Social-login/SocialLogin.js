import React, { useState } from "react";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";

function SocialLogin() {
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
    }
  };

  // Facebook Login Error
  const responseFacebookError = (error) => {
    console.log(error);
  };

  return (
    <div>
      <GoogleLogin
        clientId="your-google-client-id"
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogleError}
        cookiePolicy={"single_host_origin"}
      />

      <FacebookLogin
        appId="your-facebook-app-id"
        fields="name,email,picture"
        callback={responseFacebook}
        onFailure={responseFacebookError}
      />

      <AppleLogin
        clientId="your-apple-client-id"
        redirectURI="your-redirect-uri"
        onSuccess={responseApple}
        onError={responseAppleError}
        responseType="code id_token"
      />

      {accessToken && <p>Access Token: {accessToken}</p>}
    </div>
  );
}

export default SocialLogin;