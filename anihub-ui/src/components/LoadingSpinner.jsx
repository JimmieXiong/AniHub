import React from "react";
import styled, { keyframes } from "styled-components";

export default function LoadingSpinner() {
  return (
    <SpinnerWrapper>
      <div className="spinner" />
    </SpinnerWrapper>
  );
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .spinner {
    border: 6px solid rgba(255, 255, 255, 0.2);
    border-top: 6px solid #09e540;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    animation: ${spin} 1s linear infinite;
  }
`;
