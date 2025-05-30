import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { IoPlayCircleSharp } from "react-icons/io5";
import { AiOutlinePlus, AiOutlineCheck } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import { Link } from "react-router-dom";

import {
  addToMyList,
  removeFromMyList,
  isInMyList,
} from "../utils/firestoreUtils";

export default function Card({ anime }) {
  // Hover state showing extra info
  const [isHovered, setIsHovered] = useState(false);

  // Track if the anime is in the user's My List
  const [isInList, setIsInList] = useState(false);

  // fallback missing data
  const title = anime.name?.trim() || anime.title?.trim() || "Untitled";
  const image = anime.img || anime.image;
  const animeId = anime.id || anime.slug || anime.animeId;

  // Show extra info like episode number and sub/dub
  const episode =
    anime.episode && anime.episode !== "Unknown Ep" ? anime.episode : null;
  const subOrDub = anime.subOrDub || null;
  const extraInfo = [episode, subOrDub].filter(Boolean).join(" • ");

  // Check if anime is already saved to the user's My List
  useEffect(() => {
    const check = async () => {
      const exists = await isInMyList(animeId);
      setIsInList(exists);
    };
    check();
  }, [animeId]);

  // Add anime to My List
  const handleAdd = async (e) => {
    e.stopPropagation();  // prevent click from triggering navigation
    e.preventDefault();
    await addToMyList(anime);
    setIsInList(true);
  };

  // Remove anime from My List
  const handleRemove = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    await removeFromMyList(animeId);
    setIsInList(false);
  };

  return (
    <Link to={`/anime/${animeId}`} style={{ textDecoration: "none" }}>
      <Container
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={image} alt={title} />
        <div className="title">{title}</div>

        {/* Hover overlay with extra info and action buttons */}
        {isHovered && (
          <div className="hover">
            <img src={image} alt="preview" />
            <div className="info">
              <h3>{title}</h3>
              {extraInfo && <p>{extraInfo}</p>}

              <div className="icons">
                <IconWrapper title="Play">
                  <IoPlayCircleSharp />
                </IconWrapper>

                {!isInList ? (
                  <IconWrapper title="Add to My List" onClick={handleAdd}>
                    <AiOutlinePlus />
                  </IconWrapper>
                ) : (
                  <>
                    <IconWrapper title="In My List">
                      <AiOutlineCheck style={{ color: "lightgreen" }} />
                    </IconWrapper>
                    <IconWrapper title="Remove from My List" onClick={handleRemove}>
                      <MdClose style={{ color: "#ff4e4e" }} />
                    </IconWrapper>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </Link>
  );
}


const Container = styled.div`
  width: 160px;
  position: relative;
  cursor: pointer;

  img {
    width: 100%;
    height: auto;
    border-radius: 0.4rem;
  }

  .title {
    font-size: 0.85rem;
    margin-top: 0.3rem;
    text-align: center;
    color: #fff;
    line-height: 1.2;
  }

  // Hover overlay styles
  .hover {
    position: absolute;
    top: -10rem;
    left: -3rem;
    z-index: 10;
    width: 300px;
    background-color: #181818;
    border-radius: 0.3rem;
    padding: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);

    img {
      width: 100%;
      height: 140px;
      object-fit: cover;
      border-radius: 0.3rem;
    }

    .info {
      margin-top: 0.5rem;

      h3 {
        font-size: 1rem;
        margin: 0;
        color: #fff;
      }

      p {
        font-size: 0.75rem;
        color: #ccc;
        margin: 0.3rem 0;
      }

      .icons {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }
    }
  }
`;

// for play, add/remove
const IconWrapper = styled.div`
  color: #fff;
  font-size: 1.4rem;
  cursor: pointer;
  position: relative;

  // Tooltip on hover
  &:hover::after {
    content: attr(title);
    position: absolute;
    bottom: -1.8rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.75);
    padding: 2px 8px;
    font-size: 0.7rem;
    border-radius: 4px;
    color: white;
    white-space: nowrap;
  }

  svg {
    transition: color 0.2s;
    &:hover {
      color: #999;
    }
  }
`;
