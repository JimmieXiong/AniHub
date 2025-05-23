import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Movies() {
  // Get the current page number from the URL or default to 1
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page")) || 1;

  const [movies, setMovies] = useState([]);         // List of fetched movies
  const [page, setPage] = useState(pageParam);      // Current page number
  const [totalPages, setTotalPages] = useState(1);  // Total number of pages from the backend
  const [loading, setLoading] = useState(true);     

  // Keep `page` state in sync with URL param
  useEffect(() => {
    setPage(pageParam);
  }, [pageParam]);

  // Fetch movie data whenever the page changes
  useEffect(() => {
    setLoading(true);

    axios
      .get(`http://localhost:3001/aniwatchtv/movie?page=${pageParam}`)
      .then((res) => {
        const movieResults = res.data.animes || [];
        setMovies(movieResults);                         // Set movie data
        setTotalPages(res.data.totalPages || 1);         // Set total number of pages
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch movies:", err.message);
        setLoading(false);
      });
  }, [pageParam]);

  // Handles user clicking a different pagination button
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ page: newPage }); // Update URL to reflect new page
    }
  };

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

  return (
    <div style={styles.wrapper}>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.heading}>Movies</h1>

        {loading ? (
          <p>Loading movies...</p>
        ) : movies.length === 0 ? (
          <p>No movies found.</p>
        ) : (
          <>
            {/* Grid of movie cards */}
            <div style={styles.grid}>
              {movies.map((anime, index) => {
                const animeId = anime.id || anime.animeId || anime.slug;
                const title = anime.name?.trim() || anime.title?.trim() || "Untitled";

                return (
                  <Link
                    to={`/anime/${animeId}`}
                    key={animeId || index}
                    style={{ textDecoration: "none" }}
                  >
                    <div style={styles.card}>
                      <div style={styles.imageWrapper}>
                        <img src={anime.img} alt={title} style={styles.image} />
                        <div style={styles.titleOverlay}>
                          <h3 style={styles.title}>{title}</h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

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
