import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// If you have global styles, import them here
// import './index.css';

// Create a root element for your app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render your App component into the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
