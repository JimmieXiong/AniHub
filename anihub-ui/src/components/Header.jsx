import React from "react";
import styled from "styled-components";
import logo from "../assets/Logo.png";

export default function Header() {
  return (
    <Container>
      <div className="logo">
        <img src={logo} alt="AniHub Logo" />
      </div>
    </Container>
  );
}

const Container = styled.div`
  .logo {
    img {
      height: 10rem;
    }
  }
`;
