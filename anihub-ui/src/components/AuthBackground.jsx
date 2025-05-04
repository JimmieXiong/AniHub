
import React from "react";
import styled from "styled-components";
import loginBackground from "../assets/authbackground.jpeg";

export default function AuthBackground() {
  return (
    <Container>
      <img src={loginBackground} alt="Auth Background" />
      <div className="overlay" />
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.55);
  }
`;
