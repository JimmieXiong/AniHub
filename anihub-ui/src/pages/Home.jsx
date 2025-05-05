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

  useEffect(() => {
    axios
      .get("http://localhost:3001/aniwatchtv")
      .then((res) => {
        const mostPopular = res.data.featuredAnimes?.mostPopularAnimes || [];
        const top10 = res.data.top10Animes?.day || [];
        const latestEpisodes = res.data.latestEpisodes || [];

        setMostPopular(mostPopular);
        setTop10Day(top10);
        setLatest(latestEpisodes);
      })
      .catch((err) => {
        console.error("Failed to fetch home data:", err.message);
      });
  }, []);

  const renderGrid = (title, data) => (
    <Section>
      <h2>{title}</h2>
      <Grid>
        {data.map((anime, index) => (
          <Card key={anime.id || index} anime={anime} />
        ))}
      </Grid>
    </Section>
  );

  return (
    <PageWrapper>
      <Navbar />
      <Container>
        <FilterRow>
          <FilterButton onClick={() => navigate("/origin/japan")} $bg="#e91e63">
            Japanese Anime
          </FilterButton>
          <FilterButton onClick={() => navigate("/origin/china")} $bg="#3f51b5">
            Chinese Anime
          </FilterButton>
        </FilterRow>

        {top10Day.length > 0 && renderGrid("Top 10 (Today)", top10Day)}
        {mostPopular.length > 0 && renderGrid("Most Popular", mostPopular)}

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

// STYLES
const PageWrapper = styled.div`
  background-color: #0d0d0d;
  min-height: 100vh;
`;

const Container = styled.div`
  padding: 2rem 0;
  margin-top: 6rem;
  color: #fff;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  margin: 0 2rem 1.5rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  color: #fff;
  background-color: ${({ $bg }) => $bg || "#555"};
`;

const Section = styled.div`
  margin: 2rem 2rem 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ViewMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

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
