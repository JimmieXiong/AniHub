import React from 'react';
import ReactDOM from 'react-dom/client';
import "./styles/index.css";// Import the global CSS file
import App from './App'; 

// Create a root element to render the React component tree
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

