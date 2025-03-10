import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import BackgroundImage from '../../assets/Home.png';
import MovieLogo from '../../assets/home-title.png';
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset !== 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      <div className="hero">
        <img src={BackgroundImage} alt="background" className="background-image" />
        <div className="overlay"></div>
        <div className="container">
          <div className="login">
            <img src={MovieLogo} alt="Movie Logo" />
          </div>
          <div className="buttons flex">
            <button className="flex j-center a-center" onClick={() => navigate("/player")}>
              <FaPlay />
              Play
            </button>
            <button className="flex j-center a-center">
              <AiOutlineInfoCircle />
              More Info
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  background-color: black;
  .hero {
    position: relative;
    .background-image {
      height: 100vh;
      width: 100vw;
      object-fit: cover;
    }
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3));
    }
    .container {
      position: absolute;
      bottom: 5rem;
      left: 5rem;
      .login {
        img {
          width: 500px; /* Adjust the width as needed */
          height: auto; /* Maintain aspect ratio */
          filter: drop-shadow(2px 4px 6px black); /* Add shadow to make it stand out */
        }
      }
      .buttons {
        margin-top: 2rem;
        display: flex;
        gap: 2rem;
        button {
          font-size: 1.4rem;
          gap: 1rem;
          border-radius: 0.2rem;
          padding: 0.5rem 2rem;
          border: none;
          cursor: pointer;
          transition: 0.2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
          &:hover {
            opacity: 0.8;
          }
          &:nth-of-type(1) {
            background-color:rgb(74, 201, 57);
            color: white;
            svg {
              font-size: 1.8rem;
            }
          }
          &:nth-of-type(2) {
            background-color: rgba(109, 109, 110, 0.7);
            color: white;
            svg {
              font-size: 1.8rem;
            }
          }
        }
      }
    }
  }
`;

