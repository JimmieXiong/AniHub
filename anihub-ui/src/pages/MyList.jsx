import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import styled from "styled-components";
import { getMyList } from "../utils/firestoreUtils";

export default function MyList() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyList = async () => {
      try {
        const list = await getMyList();
        setAnimeList(list);
      } catch (err) {
        console.error("Failed to fetch My List:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyList();
  }, []);

  return (
    <Wrapper>
      <Navbar />
      <Container>
        <h1>My Anime List</h1>

        {loading ? (
          <p>Loading your list...</p>
        ) : animeList.length === 0 ? (
          <p>You haven't added any anime yet. Start adding from the homepage!</p>
        ) : (
          <Grid>
            {animeList.map((anime, index) => (
              <Card key={anime.id || index} anime={anime} />
            ))}
          </Grid>
        )}
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: #0d0d0d;
  min-height: 100vh;
`;

const Container = styled.div`
  padding: 2rem;
  margin-top: 6rem;
  color: #fff;

  h1 {
    margin-bottom: 1.5rem;
  }

  p {
    font-size: 1rem;
    color: #ccc;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.5rem;
`;
