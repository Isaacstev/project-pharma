// src/components/SocialLogin.js

import React from 'react';
import '../styles/Form.css';  // Import the form-specific styles

const SocialLogin = () => {
  return (
    <div className="social-login">
      <button className="social-button google-button">Sign in with Google</button>
      <button className="social-button apple-button">Sign in with Apple</button>
    </div>
  );
};

export default SocialLogin;
