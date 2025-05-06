import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

// Inline styling object for the component
const styles = {
  wrapper: {
    backgroundColor: "#0d0d0d",
    minHeight: "100vh",
  },
  container: {
    padding: "2rem",
    fontFamily: "sans-serif",
    position: "relative",
    zIndex: 2,
    color: "#fff",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  heading: {
    marginBottom: "1.5rem",
    fontSize: "2rem",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.2s ease-in-out",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: "3 / 4",
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
    WebkitLineClamp: 2,
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

export default function LatestEpisodes() {
  // Access URL query parameter "page" (or default to 1)
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  // State for episodes data, pagination, loading, and error
  const [episodes, setEpisodes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ensure the URL always has a "page" param to prevent undefined state
  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams({ page: "1" });
    }
  }, [searchParams, setSearchParams]);

  // Fetch latest episodes when the current page changes
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `http://localhost:3001/aniwatchtv/latest?page=${pageParam}`
        );

        const { latestEpisodes = [], totalPages = 1 } = res.data;

        setEpisodes(latestEpisodes);
        setTotalPages(totalPages);
        console.log("Fetched episodes:", latestEpisodes);
      } catch (err) {
        console.error("Failed to fetch latest episodes:", err.message);
        setError("Failed to load episodes. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [pageParam]);

  // Handler to update the page number in the URL
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ page: newPage.toString() });
    }
  };

  // Calculates visible page buttons for pagination
  const getVisiblePages = () => {
    const maxVisible = 5;
    let start = Math.max(1, pageParam - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }
    return [...Array(end - start + 1).keys()].map((i) => start + i);
  };

  // Render
  return (
    <div style={styles.wrapper}>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.heading}>Latest Episode Updates</h1>

        {/* Conditional rendering: show loading, error, or data */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : episodes.length === 0 ? (
          <p>No episodes found.</p>
        ) : (
          <>
            {/* Episode Grid */}
            <div style={styles.grid}>
              {episodes.map((anime, index) => {
                const animeId = anime.id || anime.animeId || anime.slug;
                const title = anime.name?.trim() || anime.title?.trim() || "Untitled";
                const image = anime.img || anime.image;

                console.log("Anime debug:", { anime, animeId });

                return (
                  <Link
                    key={animeId || index}
                    to={`/anime/${animeId}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div style={styles.card}>
                      <div style={styles.imageWrapper}>
                        <img
                          src={image}
                          alt={`Poster of ${title}`}
                          style={styles.image}
                        />
                        <div style={styles.titleOverlay}>
                          <h3 style={styles.title}>{title}</h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div style={styles.pagination}>
              <button
                onClick={() => handlePageChange(1)}
                disabled={pageParam === 1}
                style={styles.pageButton}
              >
                «
              </button>
              <button
                onClick={() => handlePageChange(pageParam - 1)}
                disabled={pageParam === 1}
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
                    ...(pg === pageParam ? styles.activePageButton : {}),
                  }}
                >
                  {pg}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(pageParam + 1)}
                disabled={pageParam === totalPages}
                style={styles.pageButton}
              >
                ›
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={pageParam === totalPages}
                style={styles.pageButton}
              >
                »
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
