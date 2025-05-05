import React, { useState } from 'react';
import styled from 'styled-components';
import AuthBackground from "../components/AuthBackground";
import Header from '../components/Header';
import { firebaseAuth } from '../utils/firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../utils/firebase-config";

export default function Signup() {
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setError('');
  };

  const handleSignUp = async () => {
    const { email, password } = formValues;

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setSuccessMessage("Successfully created account!");
    setLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(firebaseAuth, email, password);

      await setDoc(doc(firestore, "users", user.uid), {
        email: user.email,
        isPremium: false,
      });

      setTimeout(() => {
        setLoading(false);
        navigate("/home");
      }, 3000);
    } catch (error) {
      console.error("Signup failed:", error.message);
      setError("Signup failed. Try a different email.");
      setSuccessMessage('');
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message={successMessage} />;
  }

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
            <h3>Create Account</h3>
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
            {error && <p className="error-text">{error}</p>}
            <button onClick={handleSignUp}>Create Account</button>
            <div className="or-text">or</div>
            <button className="login-button" onClick={() => navigate('/login')}>
              Login
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
