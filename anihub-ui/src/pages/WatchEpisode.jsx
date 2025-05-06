import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function WatchEpisode() {
  // Get dynamic episodeId from route parameters
  const { episodeId } = useParams();

  // Access query parameters (?ep=xxx) from URL
  const location = useLocation();

  // State variables to manage video loading, success, and errors
  const [videoUrl, setVideoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect runs when component mounts or when episodeId/query changes
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Extract the query parameter "ep" from the URL
        const searchParams = new URLSearchParams(location.search);
        const epId = searchParams.get("ep");

        // Validate both route and query parameters
        if (!episodeId || !epId) {
          setError("Missing episode parameters");
          return;
        }

        // API call to fetch video sources for the episode
        const url = `http://localhost:3001/aniwatchtv/episode-srcs?id=${episodeId}?ep=${epId}&server=MegaCloud&category=sub`;
        const res = await axios.get(url);

        // Extract the list of video sources from response
        const sources = res.data?.sources || [];

        // Pick the HLS stream if available, fallback to first source
        const hlsSource = sources.find((src) => src.type === "hls") || sources[0];

        // If no video URL was found, set error
        if (!hlsSource?.url) {
          setError("No playable video source found");
          return;
        }

        // Set video URL in state
        setVideoUrl(hlsSource.url);
      } catch (err) {
        console.error("Failed to fetch video source:", err);
        setError("Failed to load video. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [episodeId, location.search]); // Re-run if episodeId or query string changes

  return (
    <>
      {/* Inline styling for player layout, form, and buttons */}
      <style>{`
        .watch-wrapper {
          background-color: #0d0d0d;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          color: white;
          position: relative;
          z-index: 1;
        }

        .watch-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
        }

        .watch-content {
          max-width: 1000px;
          width: 100%;
          text-align: center;
        }

        .video-player {
          width: 100%;
          max-width: 800px;
          aspect-ratio: 16 / 9;
          margin: 0 auto 2rem;
          background: black;
          border: 1px solid #444;
          border-radius: 10px;
          overflow: hidden;
        }

        .controls-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .controls-section input[type="text"] {
          width: 100%;
          max-width: 500px;
          padding: 0.5rem;
          font-family: monospace;
          border-radius: 4px;
          border: 1px solid #666;
          background: #111;
          color: white;
        }

        button {
          margin-top: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          font-weight: bold;
          background-color: #4f46e5;
          color: white;
          border: none;
          cursor: pointer;
        }

        button:hover {
          background-color: #4338ca;
        }
      `}</style>

      {/* Page wrapper */}
      <div className="watch-wrapper">
        {/* Navbar remains visible for consistency */}
        <Navbar />
        <div className="watch-container">
          <div className="watch-content">
            <h1>Now Playing</h1>
            <p>Episode: {episodeId}</p>

            {/* Conditional UI logic */}
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <div>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
              </div>
            ) : (
              <>
                {/* Main video player */}
                <div className="video-player">
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>

                {/* Extra info & manual player option */}
                <div className="controls-section">
                  <h3>Player Option</h3>
                  <p>
                    Due to CORS not accepting localhost, MegaCloud must be played manually.<br />
                    Please copy the link and paste it in VLC Media Player or another video player.
                  </p>
                  <input
                    type="text"
                    value={videoUrl}
                    readOnly
                    onClick={(e) => e.target.select()}
                  />
                  <button onClick={() => navigator.clipboard.writeText(videoUrl)}>
                    Copy Link
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
