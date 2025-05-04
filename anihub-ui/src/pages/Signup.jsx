import React, { useState } from 'react';
import styled from 'styled-components';
import AuthBackground from "../components/AuthBackground";
import Header from '../components/Header';
import { firebaseAuth } from '../utils/firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Handle signup using Firebase
  const handleSignUp = async () => {
    try {
      const { email, password } = formValues;
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      // Redirect is now handled globally by <PublicRoute>
    } catch (error) {
      console.error("Signup failed:", error.message);
      // You can show an error message to the user here
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
  // Sets the container to cover full screen and prevent overflow
  position: relative;
  height: 100vh;
  width: 100vw;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;

  .content {
    // Covers the full screen behind content
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center; // vertically center the .body
    justify-content: center; // horizontally center the .body
  }


  .body {
    // Card containing the form
    align-items: center;
    text-align: center;
    max-width: 420px; // max card width
    background: rgba(255, 255, 255, 0.1); // semi-transparent white
    backdrop-filter: blur(14px); // blur behind it
    border-radius: 16px;
    padding: 2.5rem 2rem; // spacing inside the card
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); // subtle shadow
    border: 1px solid rgba(255, 255, 255, 0.2); // subtle border
    color: #fff; // default text color
  }

  .text {
    margin-bottom: 0.5rem; // spacing under the headline section

    h1 {
      font-size: 1.8rem; // main headline
      font-weight: 600;
      line-height: 1.4;
    }

    h4 {
      font-size: 1rem; // subtitle
      font-weight: 400;
    }
  }

  .title {
    margin-top: 0.75rem; // space before "Create Account"

    h3 {
      font-size: 1.3rem;
      font-weight: 600;
      color: #fff;
    }
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1rem; // space between inputs and buttons
    width: 100%;
    margin-top: 1rem;

    input {
      padding: 0.75rem 1rem;
      font-size: 1rem;
      background: rgba(255, 255, 255, 0.15); // semi-transparent input
      border: 1px solid rgba(255, 255, 255, 0.3); // soft border
      border-radius: 8px;
      color: #fff;

      &::placeholder {
        color: #ccc; // light placeholder text
      }

      &:focus {
        outline: none;
        border-color: #fff; // white border on focus
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
      background-color: #e50914; // Netflix red
      color: white;
      border: none;

      &:hover {
        background-color: #f40612; // brighter red
        transform: translateY(-1px); // lift effect on hover
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
        transform: translateY(-1px); // same lift effect
      }
    }
  }
`;

