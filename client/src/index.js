// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';  // Updated path to reflect 'styles' subfolder
import App from './app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
