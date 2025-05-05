import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const pageParam = parseInt(searchParams.get("page")) || 1;

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(pageParam);
  }, [pageParam]);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    axios
      .get(
        `http://localhost:3001/aniwatchtv/search?keyword=${encodeURIComponent(
          query
        )}&page=${page}`
      )
      .then((res) => {
        setResults(res.data.animes || []);
        setTotalPages(res.data.totalPages || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch search results:", err.message);
        setLoading(false);
      });
  }, [query, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ q: query, page: newPage });
    }
  };

  return (
    <div style={styles.wrapper}>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.heading}>Search Results for "{query}"</h1>

        {loading && page === 1 ? (
          <p>Loading...</p>
        ) : results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <>
            <div style={styles.grid}>
              {results.map((anime, index) => {
                const animeId = anime.id || anime.animeId || anime.slug;
                const title =
                  anime.name?.trim() || anime.title?.trim() || "Untitled";
                return (
                  <Link
                    key={`${animeId}-${index}`}
                    to={`/anime/${animeId}`}
                    style={styles.cardLink}
                  >
                    <div style={styles.card}>
                      <img src={anime.img} alt={title} style={styles.image} />
                      <h3 style={styles.title}>{title}</h3>
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

              {[...Array(totalPages).keys()].slice(0, 5).map((i) => {
                const pg = i + 1;
                return (
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
                );
              })}

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
    color: "#fff",
    position: "relative",
    zIndex: 2,
    maxWidth: "1200px",
    margin: "0 auto",
  },
  heading: {
    fontSize: "1.8rem",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "1.5rem",
  },
  cardLink: {
    textDecoration: "none",
    color: "#fff",
  },
  card: {
    backgroundColor: "#1f1f1f",
    borderRadius: "8px",
    padding: "0.75rem",
    textAlign: "center",
    boxShadow: "0 0 8px rgba(0, 0, 0, 0.5)",
    transition: "transform 0.2s ease-in-out",
  },
  image: {
    width: "100%",
    borderRadius: "6px",
    objectFit: "cover",
  },
  title: {
    fontSize: "0.95rem",
    marginTop: "0.6rem",
    color: "#fff",
  },
  pagination: {
    marginTop: "2rem",
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
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
