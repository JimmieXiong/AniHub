import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const pageParam = parseInt(searchParams.get("page")) || 1;

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync local state with URL
  useEffect(() => {
    setPage(pageParam);
  }, [pageParam]);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    axios
      .get(`http://localhost:3001/aniwatchtv/search?keyword=${encodeURIComponent(query)}&page=${page}`)
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
    <div style={styles.container}>
      <h1>Search Results for "{query}"</h1>
      {loading && page === 1 ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <>
          <div style={styles.grid}>
            {results.map((anime, index) => (
              <div
                style={styles.card}
                key={`${anime.id.split("?")[0]}-${index}`}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
              >
                <img src={anime.img} alt={anime.name} style={styles.image} />
                <h3 style={styles.title}>{anime.name}</h3>
              </div>
            ))}
          </div>

          <div style={styles.pagination}>
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} style={styles.pageButton}>
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

            <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} style={styles.pageButton}>
              ›
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "sans-serif",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "#f8f8f8",
    borderRadius: "8px",
    padding: "1rem",
    textAlign: "center",
    boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    borderRadius: "4px",
    objectFit: "cover",
  },
  title: {
    fontSize: "1rem",
    marginTop: "0.5rem",
    color: "#222",
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
