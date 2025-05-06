import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function OriginAnime() {
  // Extract the country from the route  /origin/
  const { country } = useParams();

  // Get and update search params like ?page=2
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page")) || 1;

  // Component state
  const [animeList, setAnimeList] = useState([]);        // 20 anime per page
  const [loading, setLoading] = useState(true);          
  const [page, setPage] = useState(pageParam);           // Current page
  const [totalPages, setTotalPages] = useState(1);       // Total pages after filtering
  const [fullList, setFullList] = useState([]);          // All anime from that origin

  // Sync local page state with the URL
  useEffect(() => {
    setPage(pageParam);
  }, [pageParam]);

  // Fetch and filter the anime based on origin (Japan/China)
  useEffect(() => {
    setLoading(true);

    axios
      .get("/anime-origin-data.json") // Load local pre-scraped data
      .then((res) => {
        // Filter anime where origin matches URL country param
        const filtered = res.data.filter(
          (anime) =>
            anime.origin &&
            anime.origin.toLowerCase() === country.toLowerCase()
        );

        setFullList(filtered);                          // Store the full list
        setTotalPages(Math.ceil(filtered.length / 20)); // Update total pages
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load anime:", err.message);
        setLoading(false);
      });
  }, [country]);

  // Slice the correct 20 items for the current page
  useEffect(() => {
    const start = (page - 1) * 20;
    const paged = fullList.slice(start, start + 20);
    setAnimeList(paged);
  }, [fullList, page]);

  // Handle page navigation + URL update
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ page: newPage });
    }
  };

  // Generate an array of visible pagination buttons (max 5 at a time)
  const getVisiblePages = () => {
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    return [...Array(end - start + 1).keys()].map((i) => start + i);
  };

  const displayName =
    country.toLowerCase() === "japan"
      ? "Japanese"
      : country.toLowerCase() === "china"
      ? "Chinese"
      : "Unknown";

  return (
    <div style={styles.wrapper}>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.heading}>{displayName} Anime</h1>

        {loading ? (
          <p>Loading...</p>
        ) : animeList.length === 0 ? (
          <p>No anime found.</p>
        ) : (
          <>
            {/* Anime cards */}
            <div style={styles.grid}>
              {animeList.map((anime) => (
                <div key={anime.id} style={styles.card}>
                  <div style={styles.imageWrapper}>
                    <img src={anime.img} alt={anime.name} style={styles.image} />
                    <div style={styles.titleOverlay}>
                      <h3 style={styles.title}>{anime.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            <div style={styles.pagination}>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                style={styles.pageButton}
              >
                ‹
              </button>

              {getVisiblePages().map((pg) => (
                <button
                  key={pg}
                  onClick={() => handlePageChange(pg)}
                  style={{
                    ...styles.pageButton,
                    ...(pg === page ? styles.activePageButton : {}),
                  }}
                >
                  {pg}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                style={styles.pageButton}
              >
                ›
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}



const styles = {
  wrapper: {
    backgroundColor: "#0d0d0d",
    minHeight: "100vh", // Full screen dark background
  },
  container: {
    padding: "2rem",
    fontFamily: "sans-serif",
    color: "#fff",
    maxWidth: "1200px",
    margin: "0 auto", // Centered content
  },
  heading: {
    marginBottom: "1.5rem",
    fontSize: "2rem",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "1.5rem", // Card spacing
  },
  card: {
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#1c1c1c",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
    transition: "transform 0.2s ease-in-out",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: "3 / 4", // Keeps image proportions consistent
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  titleOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: "0.5rem",
    textAlign: "center",
  },
  title: {
    fontSize: "0.9rem",
    margin: 0,
    color: "#fff",
    lineHeight: "1.2",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2, // Truncate title to 2 lines
    WebkitBoxOrient: "vertical",
    whiteSpace: "normal",
  },
  pagination: {
    marginTop: "2rem",
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  pageButton: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    minWidth: "40px",
    height: "40px",
  },
  activePageButton: {
    backgroundColor: "#ffe08a",
    color: "#000",
    fontWeight: "bold",
  },
};
