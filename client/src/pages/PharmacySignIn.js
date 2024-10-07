// src/pages/PharmacySignIn.js

import React, { useState } from 'react';
import SocialLogin from '../components/SocialLogin';
import '../styles/Form.css';  // Import form-specific styles

const PharmacySignIn = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <div className="form-container">
      <h1>Pharmacy {isSignUp ? 'Sign Up' : 'Login'}</h1>

      {/* Toggle Button for Switching Between Sign Up and Login */}
      <button className="toggle-button" onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Log In' : 'New user? Sign Up'}
      </button>

      {/* Sign-Up Form */}
      {isSignUp && (
        <form className="form">
          <input type="text" placeholder="Pharmacy Name" required />
          <input type="email" placeholder="Email" required />
          <input type="tel" placeholder="Phone Number" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Sign Up</button>
        </form>
      )}

      {/* Login Form */}
      {!isSignUp && (
        <form className="form">
          <input type="text" placeholder="Email or Phone Number" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      )}

      {/* Social Login Options */}
      <SocialLogin />
    </div>
  );
};

// Ensure the default export is correctly defined
export default PharmacySignIn;
