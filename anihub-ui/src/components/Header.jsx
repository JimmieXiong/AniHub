import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png'; 

export default function Header() {
  const navigate = useNavigate();

  return (
    <Container className="flex a-center j-between">
      <div className="logo" onClick={() => navigate('/')}>
        <img src={logo} alt="AniHub Logo" />
      </div>
    </Container>
  );
}

const Container = styled.div`
  padding: 0 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo {
    cursor: pointer;
    img {
      height: 10rem !important; /* Adjust the height to make the logo bigger */
      width: auto !important; /* Maintain aspect ratio */
      max-height: 100% !important; /* Ensure it doesn't exceed the container's height */
    }
  }
`;