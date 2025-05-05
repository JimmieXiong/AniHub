import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function OriginAnime() {
  const { country } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page")) || 1;

  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(1);
  const [fullList, setFullList] = useState([]);

  useEffect(() => {
    setPage(pageParam);
  }, [pageParam]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/anime-origin-data.json")
      .then((res) => {
        const filtered = res.data.filter(
          (anime) =>
            anime.origin &&
            anime.origin.toLowerCase() === country.toLowerCase()
        );
        setFullList(filtered);
        setTotalPages(Math.ceil(filtered.length / 20));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load anime:", err.message);
        setLoading(false);
      });
  }, [country]);

  useEffect(() => {
    const start = (page - 1) * 20;
    const paged = fullList.slice(start, start + 20);
    setAnimeList(paged);
  }, [fullList, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ page: newPage });
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
    backgroundColor: "#1c1c1c",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
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
