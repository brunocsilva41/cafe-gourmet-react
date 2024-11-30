import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleLogin } from 'react-google-login';

const SocialLogin = () => {
  const handleGoogleSuccess = (response) => {
    console.log('Google login successful:', response);
  };

  const handleGoogleFailure = (response) => {
    console.log('Google login failed:', response);
  };

  const handleFacebookResponse = (response) => {
    console.log('Facebook login successful:', response);
  };

  return (
    <div className="social-login-container">
      <GoogleLogin
        clientId="YOUR_GOOGLE_CLIENT_ID"
        buttonText="Login com Google"
        onSuccess={handleGoogleSuccess}
        onFailure={handleGoogleFailure}
        cookiePolicy={'single_host_origin'}
      />
      <FacebookLogin
        appId="YOUR_FACEBOOK_APP_ID"
        autoLoad={false}
        fields="name,email,picture"
        callback={handleFacebookResponse}
        render={renderProps => (
          <button onClick={renderProps.onClick}>Login com Facebook</button>
        )}
      />
    </div>
  );
};

export default SocialLogin;