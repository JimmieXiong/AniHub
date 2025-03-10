import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BackgroundImage from '../../components/ui/BackgroundImage.jsx';
import Header from '../../components/layout/Header.jsx';
import { firebaseAuth } from '../../config/firebase-config.js';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


export default function Signup() {

  // formValues stores the email and password.
  const [formValues, setFormValues] = useState({
    email: '',
    password: ''
  });
  
  // useNavigate() allows navigation between pages 
  const navigate = useNavigate();

  /**
   * When the user clicks Create Account, firebase tries to create an account with the entered email and password.
   * If successful, the user is automatically logged in and redicted to /home by onAuthStateChanged.
   */
  const handleSignIn = async () => {
    try {
      const { email, password } = formValues;
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      console.log(error);
    }
  };
  
  // useEffect ensures authentication check runs only when the component mounts.
  // Firebase listens for authentication state changes. If user is already logged in they're auto redicted to /home.
  useEffect(() => {
  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) navigate("/home"); // Navigate to /home on successful signup.
  });
  }, [navigate]);

  // updates the email and password state when the user types.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  
  // Renders Signup Page
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
            <button onClick={handleSignIn}>Create Account</button>
            <div className="or-text">or</div>
            <button className="login-button" onClick={() => navigate('/login')}>Login</button>
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
    justify-content: flex-start; /* Align content to the top */
    padding-top: 2rem; /* Adjust padding to move content up */
    .body {
      margin-top: 2rem; /* Add margin to move content up */
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
      padding-top: 1rem; /* Adjust padding for smaller screens */
      .body {
        margin-top: 1rem; /* Adjust margin for smaller screens */
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