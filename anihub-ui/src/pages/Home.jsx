import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";    
import Card from "../components/Card";        
import styled from "styled-components";       

export default function Home() {

  const navigate = useNavigate(); 
  const [mostPopular, setMostPopular] = useState([]);
  const [top10Day, setTop10Day] = useState([]);
  const [latest, setLatest] = useState([]);

  // fetches anime data when the page loads
  useEffect(() => {
    axios
      .get("http://localhost:3001/aniwatchtv") // Call backend API
      .then((res) => {
        // Extract and fallback to empty arrays if data is missing
        const mostPopular = res.data.featuredAnimes?.mostPopularAnimes || [];
        const top10 = res.data.top10Animes?.day || [];
        const latestEpisodes = res.data.latestEpisodes || [];

        // Set state variables
        setMostPopular(mostPopular);
        setTop10Day(top10);
        setLatest(latestEpisodes);
      })
      .catch((err) => {
        console.error("Failed to fetch aniwatchtv homepage data:", err.message);
      });
  }, []);

  // Helper to render each anime section (title + cards)
  const renderGrid = (title, data) => (
    <Section>
      <h2>{title}</h2>
      <Grid>
        {data.map((anime, index) => (
          <Card key={anime.id || index} anime={anime} /> // Render each anime card
        ))}
      </Grid>
    </Section>
  );

  // Render the actual Home page content
  return (
    <PageWrapper>
      <Navbar />

      <Container>
        {/* Filter buttons for Japanese/Chinese anime */}
        <FilterRow>
          <FilterButton onClick={() => navigate("/origin/japan")} $bg="#e91e63">
            Japanese Anime
          </FilterButton>
          <FilterButton onClick={() => navigate("/origin/china")} $bg="#3f51b5">
            Chinese Anime
          </FilterButton>
        </FilterRow>

        {/* Anime sections */}
        {top10Day.length > 0 && renderGrid("Top 10 (Today)", top10Day)}
        {mostPopular.length > 0 && renderGrid("Most Popular", mostPopular)}

        {/* Latest episodes + View More */}
        {latest.length > 0 && (
          <>
            {renderGrid("Latest Episodes", latest)}
            <ViewMoreWrapper>
              <ViewMoreButton onClick={() => navigate("/latest")}>
                View More
              </ViewMoreButton>
            </ViewMoreWrapper>
          </>
        )}
      </Container>
    </PageWrapper>
  );
}


// Page background wrapper
const PageWrapper = styled.div`
  background-color: #0d0d0d;
  min-height: 100vh;
`;

// Main container for all content
const Container = styled.div`
  padding: 2rem 0;
  margin-top: 6rem; // Leaves room for fixed navbar
  color: #fff;
`;

// Filter buttons container
const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  margin: 0 2rem 1.5rem;
`;

// Style for each filter button
const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  color: #fff;
  background-color: ${({ $bg }) => $bg || "#555"}; // Dynamic background color
`;

// Section wrapper (each anime category)
const Section = styled.div`
  margin: 2rem 2rem 0;
`;

// Grid layout for anime cards
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

// Wrapper for the "View More" button
const ViewMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

// "View More" button style
const ViewMoreButton = styled.button`
  padding: 0.6rem 1.2rem;
  background-color: #ffe08a;
  color: #000;
  font-weight: bold;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background-color: #ffcc40;
  }
`;
