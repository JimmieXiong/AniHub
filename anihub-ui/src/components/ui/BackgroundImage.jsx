import React from 'react';
import background from '../../assets/Login.jpeg';
import styled from 'styled-components';

export default function BackgroundImage() {
  return (
    <Container>
      <img src={background} alt="background" />
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;

  img {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    object-fit: cover; /* Ensure the image covers the entire container */
    object-position: center; /* Center the image */
  }
`;