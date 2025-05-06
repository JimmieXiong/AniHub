
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import AuthBackground from "../components/AuthBackground"; 
import Header from '../components/Header'; 
import { firebaseAuth } from '../utils/firebase-config'; 
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { useNavigate } from 'react-router-dom';


export default function Login() {
  // Form input state for email and password
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  // Spinner loading state
  const [loading, setLoading] = useState(false);
  // Success message shown after login
  const [successMessage, setSuccessMessage] = useState("");
  // Error message for failed login
  const [error, setError] = useState("");
  // For navigating to other routes
  const navigate = useNavigate();

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setError(""); // Clear error when user starts typing
  };

  // Login function using Firebase Auth
  const handleLogin = async () => {
    setError(""); // Clear previous errors
    const { email, password } = formValues;

    // Validation check
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true); // Show spinner
    try {
      // Attempt login
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      setSuccessMessage("Successfully logged in.");

      // After delay, hide spinner and go to /home
      setTimeout(() => {
        setLoading(false);
        navigate("/home");
      }, 2000);

    } catch (error) {
      console.error("Login failed:", error.message);

      // Handle specific Firebase errors
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setError("Incorrect email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }

      setLoading(false);
    }
  };

  // If loading, show spinner 
  if (loading) {
    return (
      <SpinnerWrapper>
        <div className="spinner" />
        {successMessage && <p className="message">{successMessage}</p>}
      </SpinnerWrapper>
    );
  }

  // Login Form UI
  return (
    <Container>
      <AuthBackground />
      <div className="content">
        <Header />
        <div className="body">
          <div className="text">
            <h1>Unlimited Donghua and Anime, Anytime, Anywhere</h1>
            <h4>Stream your favorite Chinese and Japanese animated shows</h4>
          </div>
          <div className="title">
            <h3>Login</h3>
          </div>
          <div className="form">
            {/* Email Input */}
            <input
              type="email"
              placeholder="Email address"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
            />
            {/* Password Input */}
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formValues.password}
              onChange={handleInputChange}
            />
            {/* Show error if exists */}
            {error && <p className="error-text">{error}</p>}
            {/* Login Button */}
            <button onClick={handleLogin}>Login</button>
            <div className="or-text">or</div>
            {/* Redirect to signup */}
            <button className="login-button" onClick={() => navigate('/signup')}>
              Create Account
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}


// Spinner animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Spinner overlay styling
const SpinnerWrapper = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .spinner {
    border: 6px solid rgba(255, 255, 255, 0.2);
    border-top: 6px solid #09e540;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    animation: ${spin} 1s linear infinite;
  }

  .message {
    margin-top: 1.5rem;
    font-size: 1.1rem;
    color: #fff;
    font-weight: 500;
    text-align: center;
  }
`;

// Main layout container for login
const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;

  .content {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .body {
    align-items: center;
    text-align: center;
    max-width: 420px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(14px);
    border-radius: 16px;
    padding: 2.5rem 2rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
  }

  .text {
    margin-bottom: 0.5rem;

    h1 {
      font-size: 1.8rem;
      font-weight: 600;
      line-height: 1.4;
    }

    h4 {
      font-size: 1rem;
      font-weight: 400;
    }
  }

  .title {
    margin-top: 0.75rem;

    h3 {
      font-size: 1.3rem;
      font-weight: 600;
      color: #fff;
    }
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    margin-top: 1rem;

    input {
      padding: 0.75rem 1rem;
      font-size: 1rem;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      color: #fff;

      &::placeholder {
        color: #ccc;
      }

      &:focus {
        outline: none;
        border-color: #fff;
      }
    }

    .error-text {
      color: #ff6b6b;
      font-size: 0.9rem;
      text-align: left;
      margin: -0.5rem 0 0;
    }

    button {
      padding: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: 0.2s;
      width: 100%;
    }

    // Login button style
    button:not(.login-button) {
      background-color: #e50914;
      color: white;
      border: none;

      &:hover {
        background-color: #f40612;
        transform: translateY(-1px);
      }
    }

    // Separator text
    .or-text {
      text-align: center;
      font-size: 1rem;
      font-weight: 600;
      color: #ccc;
    }

    // Signup redirect button
    .login-button {
      background: transparent;
      border: 1px solid #fff;
      color: #fff;

      &:hover {
        background-color: #fff;
        color: #000;
        transform: translateY(-1px);
      }
    }
  }
`;
