import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { signOut } from "firebase/auth";
import { FaPowerOff } from "react-icons/fa";
import { firebaseAuth } from "../utils/firebase-config";
import logo from "../assets/Logo.png";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar({ isScrolled }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const links = [
    { name: "Home", link: "/home" },
    { name: "TV Shows", link: "/tv" },
    { name: "Movies", link: "/movies" },
    { name: "My List", link: "/mylist" },
  ];

  return (
    <Container className={`${isScrolled ? "scrolled" : ""}`}>
      <NavContent>
        <Left>
          <Logo>
            <img src={logo} alt="AniHub Logo" />
          </Logo>
          <NavLinks>
            {links.map(({ name, link }) => (
              <li key={name}>
                <Link to={link}>{name}</Link>
              </li>
            ))}
          </NavLinks>
        </Left>

        <form onSubmit={handleSearchSubmit}>
          <SearchInput
            type="text"
            placeholder="Search anime..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <div className="right-section">
          <ProfileIcon onClick={() => navigate("/profile")} title="Profile">
            <FaUserCircle />
          </ProfileIcon>
          <PowerButton
            onClick={() => {
              signOut(firebaseAuth)
                .then(() => {
                  navigate("/login"); // 👈 Redirect after logout
                })
                .catch((err) => {
                  console.error("Logout failed:", err.message);
                });
            }}
            title="Sign Out"
          >
            <FaPowerOff />
          </PowerButton>
        </div>
      </NavContent>
    </Container>
  );
}

const Container = styled.nav`
  width: 100%;
  background: rgba(40, 40, 40, 0.65);
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  padding: 0.5rem 1rem;
  font-family: 'Poppins', sans-serif;
`;

const NavContent = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;

  form {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .right-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;


const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const Logo = styled.div`
  img {
    height: 4rem;
    width: auto;
  }
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin: 0;
  padding: 0;

  li {
    display: flex;
    align-items: center;

    a {
      text-decoration: none;
      color: #f0f0f0;
      font-size: 0.92rem;
      font-weight: 500;
      white-space: nowrap;
      padding: 0.2rem 0;
      line-height: 1;
      transition: color 0.3s ease;

      &:hover {
        color: #ffffff;
      }
    }
  }
`;


const SearchInput = styled.input`
  width: 100%;
  max-width: 340px;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: none;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.95);
  color: #222;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: 0.3s ease;

  &::placeholder {
    color: #888;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }
`;

const ProfileIcon = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;

  svg {
    font-size: 1.7rem;
    color: #9fe8a9;
    transition: 0.2s ease;

    &:hover {
      color: #bfffcc;
    }
  }
`;

const PowerButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;

  svg {
    font-size: 1.6rem;
    color: #ff4e4e;

    &:hover {
      color: #ff7c7c;
    }
  }
`;