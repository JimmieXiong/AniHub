import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import BackgroundImage from "../components/HomeBackground";
import CardSlider from "../components/CardSlider";
import styled from "styled-components";

export default function Home() {
  const navigate = useNavigate();
  const [spotlight, setSpotlight] = useState([]);
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [top10Day, setTop10Day] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/aniwatchtv")
      .then((res) => {
        setSpotlight(res.data.spotLightAnimes || []);
        setTrending(res.data.trendingAnimes || []);
        setLatest(res.data.latestEpisodes || []);
        setTop10Day(res.data.top10Animes?.day || []);
      })
      .catch((err) => {
        console.error("Failed to fetch anime:", err.message);
      });
  }, []);

  return (
    <>
      <Navbar />
      <BackgroundImage />
      <Container>
        <FilterRow>
          <FilterButton onClick={() => navigate("/origin/japan")} $bg="#e91e63">
            Japanese Anime
          </FilterButton>
          <FilterButton onClick={() => navigate("/origin/china")} $bg="#3f51b5">
            Chinese Anime
          </FilterButton>
        </FilterRow>

        {top10Day.length > 0 && <CardSlider title="Top 10 (Today)" data={top10Day} />}
        {spotlight.length > 0 && <CardSlider title="Spotlight" data={spotlight} />}
        {trending.length > 0 && <CardSlider title="Trending" data={trending} />}
        {latest.length > 0 && (
          <>
            <CardSlider title="Latest Episodes" data={latest} />
            <ViewMoreWrapper>
              <ViewMoreButton onClick={() => navigate("/latest")}>
                View More
              </ViewMoreButton>
            </ViewMoreWrapper>
          </>
        )}
      </Container>
    </>
  );
}

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
