import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function AnimeDetails() {
  const { animeId } = useParams();
  const navigate = useNavigate();
  const [animeDetails, setAnimeDetails] = useState(null);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [detailsRes, episodesRes] = await Promise.all([
          axios.get(`http://localhost:3001/aniwatchtv/anime/${animeId}`),
          axios.get(`http://localhost:3001/aniwatchtv/episodes/${animeId}`)
        ]);

        setAnimeDetails(detailsRes.data);
        setEpisodes(episodesRes.data.episodes || []);
      } catch (err) {
        console.error("Error fetching anime data:", err);
        navigate("/notfound");
      }
    };

    fetchDetails();
  }, [animeId, navigate]);

  if (!animeDetails) return <div className="p-4 text-white">Loading...</div>;

  const { info, relatedAnimes = [] } = animeDetails;

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "2rem",
          color: "white",
          backgroundColor: "#0d0d0d", 
          minHeight: "100vh",
        }}
      >
        {/* Anime Info */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
          <img
            src={info?.img}
            alt={info?.name || ""}
            style={{
              width: "200px",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            }}
          />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
              {info?.name || "Untitled Anime"}
            </h1>
            <p style={{ color: "#ccc", lineHeight: "1.6" }}>
              {info?.description || "No description available."}
            </p>
          </div>
        </div>

        {/* Episodes */}
        {episodes.length > 0 && (
          <>
            <h2 style={{ fontSize: "1.5rem", marginTop: "3rem", marginBottom: "1rem" }}>Episodes</h2>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              {episodes.map((ep, index) => (
                <button
                  key={ep.id || index}
                  onClick={() => navigate(`/watch/${ep.episodeId}`)}
                  style={{
                    backgroundColor: "#1f1f1f",
                    border: "1px solid #555",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  Episode {ep.number || index + 1}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Related Animes */}
        {relatedAnimes.length > 0 && (
          <>
            <h2 style={{ fontSize: "1.5rem", marginTop: "3rem", marginBottom: "1rem" }}>Related Animes</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {[...new Map(relatedAnimes.map((a) => [a.id, a])).values()].map((rel) => (
                <Link
                  key={rel.id}
                  to={`/anime/${rel.id}`}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    padding: "0.5rem",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: "#fff",
                    transition: "all 0.3s ease",
                  }}
                >
                  <img
                    src={rel.img}
                    alt={rel.name}
                    style={{
                      width: "100%",
                      borderRadius: "6px",
                      marginBottom: "0.5rem",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "0.85rem",
                      lineHeight: "1.4",
                      textAlign: "center",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {rel.name || "Untitled"}
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
