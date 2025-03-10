import React from 'react';
import styled from 'styled-components';
import logo from '../../assets/Logo.png'; 

export default function Header() {
  return (
    <Container className="flex a-center j-between">
      <div className="logo">
        <img src={logo} alt="AniHub Logo" />
      </div>
    </Container>
  );
}

const Container = styled.div`
  padding: 0 4rem;
  display: flex;
  align-items: center;
  justify-content: center; /* Center the logo horizontally */
  .logo {
    margin-top: -5rem; /* Move the logo up */
    img {
      height: 20rem; /* Keep the logo large */
      width: auto; /* Maintain aspect ratio */
      max-height: 100%; /* Ensure it doesn't exceed the container's height */
    }
  }

  @media (max-width: 1200px) {
    .logo img {
      height: 18rem; /* Adjust the height for smaller screens */
    }
  }

  @media (max-width: 992px) {
    .logo img {
      height: 16rem; /* Adjust the height for smaller screens */
    }
  }

  @media (max-width: 768px) {
    padding: 0 2rem;
    .logo {
      margin-top: -3rem; /* Adjust the margin for smaller screens */
      img {
        height: 14rem; /* Adjust the height for smaller screens */
      }
    }
  }

  @media (max-width: 576px) {
    padding: 0 1rem;
    .logo {
      margin-top: -2rem; /* Adjust the margin for very small screens */
      img {
        height: 12rem; /* Adjust the height for very small screens */
      }
    }
  }

  @media (max-width: 480px) {
    .logo img {
      height: 10rem; /* Adjust the height for very small screens */
    }
  }
`;