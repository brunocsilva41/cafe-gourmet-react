import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

initializeApp(firebaseConfig);

const SocialLogin = () => {
  const auth = getAuth();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Google login successful:', result);
    } catch (error) {
      console.log('Google login failed:', error);
    }
  };

  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Facebook login successful:', result);
    } catch (error) {
      console.log('Facebook login failed:', error);
    }
  };

  return (
    <div className="social-login-container">
      <button onClick={handleGoogleLogin}>Login com Google</button>
      <button onClick={handleFacebookLogin}>Login com Facebook</button>
    </div>
  );
};

export default SocialLogin;