import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import BackgroundImage from "../components/HomeBackground";

export default function LatestEpisodes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3001/aniwatchtv/latest?page=${currentPage}`)
      .then((res) => {
        const { animes = [], totalPages = 1 } = res.data;
        setEpisodes(Array.isArray(animes) ? animes : []);
        setTotalPages(totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch latest episodes:", err.message);
        setError("Failed to load episodes. Please try again later.");
        setLoading(false);
      });
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ page: newPage });
    }
  };

  const getVisiblePages = (page, total) => {
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > total) {
      end = total;
      start = Math.max(1, end - maxVisible + 1);
    }
    return [...Array(end - start + 1).keys()].map((i) => start + i);
  };

  return (
    <>
      <Navbar />
      <BackgroundImage />
      <div style={styles.container}>
        <h1 style={styles.heading}>Latest Episode Updates</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : episodes.length === 0 ? (
          <p>No episodes found.</p>
        ) : (
          <>
            <div style={styles.grid}>
              {episodes.map((anime, index) => {
                const title = anime.name?.trim() || anime.title?.trim() || "Untitled";
                const image = anime.img || anime.image;
                return (
                  <div key={anime.id || index} style={styles.card}>
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
                );
              })}
            </div>

            <div style={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={styles.pageButton}
              >
                ‹
              </button>

              {getVisiblePages(currentPage, totalPages).map((pg) => (
                <button
                  key={pg}
                  onClick={() => handlePageChange(pg)}
                  style={{
                    ...styles.pageButton,
                    ...(pg === currentPage ? styles.activePageButton : {}),
                  }}
                >
                  {pg}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={styles.pageButton}
              >
                ›
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "sans-serif",
    position: "relative",
    zIndex: 2,
    color: "#fff",
  },
  heading: {
    marginBottom: "1.5rem",
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
