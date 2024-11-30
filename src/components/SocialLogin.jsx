import React from 'react';

const SocialLogin = () => {
  const handleGoogleLogin = () => {
    const clientId = '731636636395-dp041m5mii0ma67ueog72b3kei3uspeo.apps.googleusercontent.com';
    const redirectUri = 'https://coffeforyou.netlify.app/conta';
    const scope = 'email profile';
    const responseType = 'token';
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;

    window.location.href = url;
  };

  const handleFacebookLogin = () => {
    const appId = '926133692789023';
    const redirectUri = 'https://coffeforyou.netlify.app/conta';
    const scope = 'email';
    const responseType = 'token';
    const url = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;

    window.location.href = url;
  };

  return (
    <div className="social-login-container">
      <button onClick={handleGoogleLogin}>Login com Google</button>
      <button onClick={handleFacebookLogin}>Login com Facebook</button>
    </div>
  );
};

export default SocialLogin;