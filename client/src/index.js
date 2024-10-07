// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';  // Ensure styles are correctly imported
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
