import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BackgroundImage from '../components/BackgroundImage';
import Header from '../components/Header';
import { firebaseAuth } from '../utils/firebase-config.js';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formValues, setFormValues] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { email, password } = formValues;
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) navigate("/home");
    });
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <Container>
      <BackgroundImage />
      <div className="content">
        <Header />
        <div className="body flex column a-center j-center">
          <div className="text flex column">
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
            <button className="create-account-button" onClick={() => navigate('/signup')}>Create Account</button>
          </div>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  .content {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .body {
      gap: 1rem;
      .text {
        gap: 1rem;
        text-align: center;
        font-size: 1.5rem; 
        h1 {
          padding: 0 1rem; 
        }
      }
      .form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        width: 80%; 
        max-width: 400px; 
        padding: 1.5rem; 
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 10px;
        input {
          width: 100%;
          padding: 0.75rem; 
          font-size: 0.9rem; 
          border: 1px solid #ccc;
          border-radius: 5px;
          &:focus {
            outline: none;
            border-color: black; 
          }
        }
        button {
          width: 100%;
          padding: 0.75rem;
          background-color: black; 
          border: none;
          cursor: pointer;
          color: white;
          font-weight: bolder;
          font-size: 1rem; 
          border-radius: 5px;
        }
        .or-text {
          margin: 0.75rem 0; 
          font-size: 0.9rem; 
          color: black;
        }
        .login-button {
          background-color: black; 
        }
      }
    }
  }

  @media (max-width: 768px) {
    .content {
      .body {
        .text {
          font-size: 1.2rem; 
          h1 {
            padding: 0 0.5rem; 
          }
        }
        .form {
          width: 90%; 
          max-width: 300px; 
          padding: 1rem; 
          input {
            padding: 0.5rem; 
            font-size: 0.8rem; 
          }
          button {
            padding: 0.5rem; 
            font-size: 0.9rem; 
          }
          .or-text {
            margin: 0.5rem 0; 
            font-size: 0.8rem; 
          }
        }
      }
    }
  }
`;