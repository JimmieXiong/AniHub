import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AniHub from './pages/AniHub';

// The main App component
export default function App() {
  return (
    // BrowserRouter is a component that keeps the UI in sync with the URL
    <BrowserRouter>
      {/* Routes is a container for all Route components */}
      <Routes>
        {/* Define a route for the login page */}
        <Route exact path="/login" element={<Login />} />
        {/* Define a route for the signup page */}
        <Route exact path="/signup" element={<Signup />} />
        {/* Define a route for the home page */}
        <Route exact path="/home" element={<AniHub />} />
      </Routes>
    </BrowserRouter>
  );
}
