import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";         
import Card from "../components/Card";            
import styled from "styled-components";           
import { getMyList } from "../utils/firestoreUtils"; 

export default function MyList() {
  const [animeList, setAnimeList] = useState([]); // Holds the saved anime data
  const [loading, setLoading] = useState(true);   // Indicates whether data is still loading

  // Fetch the user's saved anime list when the component mounts
  useEffect(() => {
    const fetchMyList = async () => {
      try {
        const list = await getMyList(); // Call Firestore utility to get list
        setAnimeList(list);             // Save results in state
      } catch (err) {
        console.error("Failed to fetch My List:", err); 
      } finally {
        setLoading(false);              // Stop loading indicator regardless of success/failure
      }
    };

    fetchMyList(); // Run the fetch function
  }, []);

  return (
    <Wrapper>
      <Navbar /> {/* Always show top nav */}
      <Container>
        <TitleSection>
          <h1>My List</h1>
          <div className="underline" /> {/* Yellow line under title */}
        </TitleSection>

        {loading ? (
          // If loading, show loading message
          <Message>Loading your list...</Message>
        ) : animeList.length === 0 ? (
          // If list is empty, show friendly message
          <Message>
            You haven't added any anime yet. <br />
            Go explore and add your favorites!
          </Message>
        ) : (
          // If list exists, show a grid of anime cards
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

// gives the whole page a dark background and full height
const Wrapper = styled.div`
  background-color: #0d0d0d;
  min-height: 100vh;
`;

// centers the content and adds padding
const Container = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 3rem 2rem;
  color: #ffffff;
`;

// Styled title section with center-aligned header and underline
const TitleSection = styled.div`
  text-align: center;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.3rem;
  }

  .underline {
    width: 60px;
    height: 4px;
    background-color: #ffe08a;
    margin: 0 auto 2rem;
    border-radius: 2px;
  }
`;

const Message = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: #ccc;
  margin-top: 2rem;
  line-height: 1.6;
`;

// Grid layout
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.8rem;
  margin-top: 1rem;
`;
