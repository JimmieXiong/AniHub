import React, { useState } from 'react';
import styled from 'styled-components';
import AuthBackground from "../components/AuthBackground";
import Header from '../components/Header';
import { firebaseAuth } from '../utils/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Attempt login using Firebase auth
  const handleLogin = async () => {
    try {
      const { email, password } = formValues;
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      // Redirect is now handled by <PublicRoute />
    } catch (error) {
      console.error("Login failed:", error.message);
      // You could display an error message here
    }
  };

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
            <input
              type="email"
              placeholder="Email address"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formValues.password}
              onChange={handleInputChange}
            />
            <button onClick={handleLogin}>Login</button>
            <div className="or-text">or</div>
            <button className="login-button" onClick={() => navigate('/signup')}>
              Create Account
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}

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

    button {
      padding: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: 0.2s;
      width: 100%;
    }

    button:not(.login-button) {
      background-color: #e50914;
      color: white;
      border: none;

      &:hover {
        background-color: #f40612;
        transform: translateY(-1px);
      }
    }

    .or-text {
      text-align: center;
      font-size: 1rem;
      font-weight: 600;
      color: #ccc;
    }

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
