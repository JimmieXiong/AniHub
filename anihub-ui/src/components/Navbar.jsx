import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { FaPowerOff, FaUserCircle } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import logo from "../assets/Logo.png";

export default function Navbar({ isScrolled }) {
  const [searchTerm, setSearchTerm] = useState("");         // Search input state
  const [dropdownOpen, setDropdownOpen] = useState(false);  // Toggle profile dropdown
  const dropdownRef = useRef(null);                         // Ref for detecting outside clicks
  const navigate = useNavigate();                           

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(""); // Clear search after navigating
    }
  };

  // Close dropdown if clicked outside of profile icon
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  // Navigate to a route and close dropdown
  const handleNav = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  // Add/remove outside click listener
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigation links to display
  const links = [
    { name: "Home", link: "/home" },
    { name: "Latest", link: "/tv" },
    { name: "Movies", link: "/movies" },
    { name: "My List", link: "/mylist" },
  ];


  // ui
  return (
    <Container className={`${isScrolled ? "scrolled" : ""}`}>
      <NavContent>
        {/* Left Side: Logo + Navigation Links */}
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

        {/* Center: Search Bar */}
        <form onSubmit={handleSearchSubmit}>
          <SearchInput
            type="text"
            placeholder="Search anime..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Right Side: Profile + Logout */}
        <div className="right-section">
          {/* Profile Dropdown */}
          <ProfileWrapper ref={dropdownRef}>
            <ProfileIcon
              onClick={() => setDropdownOpen((prev) => !prev)}
              title="Profile"
            >
              <FaUserCircle />
            </ProfileIcon>
            {dropdownOpen && (
              <DropdownMenu>
                <button onClick={() => handleNav("/profile")}>View Profile</button>
                <button onClick={() => handleNav("/change-account")}>Change Account Settings</button>
                <button onClick={() => handleNav("/subscribe")}>Subscribe to AniHub</button>
              </DropdownMenu>
            )}
          </ProfileWrapper>

          {/* Logout Button */}
          <PowerButton
            onClick={() => {
              signOut(firebaseAuth)
                .then(() => navigate("/login"))
                .catch((err) => console.error("Logout failed:", err.message));
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


// Full navbar container
const Container = styled.nav`
  width: 100%;
  background: rgba(40, 40, 40, 0.65); // translucent dark background
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  padding: 0.5rem 1rem;
  font-family: 'Poppins', sans-serif;
`;

// Inner wrapper to align logo, links, search, and user icons
const NavContent = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;

  form {
    display: flex;
    justify-content: center;
    margin: 0 auto;
    z-index: 0;
  }

  .right-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
  }
`;

// Logo and nav links area
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

// Navigation links
const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin: 0;
  padding: 0;

  li a {
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
`;

// Search input field
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

  &::placeholder {
    color: #888;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }
`;

// Profile button wrapper
const ProfileWrapper = styled.div`
  position: relative;
`;

// Profile icon 
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

// Dropdown menu under profile
const DropdownMenu = styled.div`
  position: absolute;
  top: 2.5rem;
  right: 0;
  background: #222;
  border-radius: 6px;
  padding: 0.5rem 0;
  min-width: 180px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  z-index: 9999;

  button {
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    color: #eee;
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
    cursor: pointer;

    &:hover {
      background-color: #333;
    }
  }
`;

// Logout icon
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
