import React, { useState } from "react";
import styled from "styled-components";
import { IoPlayCircleSharp } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { RiThumbUpFill, RiThumbDownFill } from "react-icons/ri";
import { BiChevronDown } from "react-icons/bi";

export default function Card({ anime }) {
  const [isHovered, setIsHovered] = useState(false);
  const title = anime.name?.trim() || anime.title?.trim() || "Untitled";
  const image = anime.img || anime.image;
  const episode = anime.episode && anime.episode !== "Unknown Ep" ? anime.episode : null;
  const subOrDub = anime.subOrDub || null;
  const extraInfo = [episode, subOrDub].filter(Boolean).join(" • ");

  return (
    <Container
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={image} alt={title} />
      <div className="title">{title}</div>
      {isHovered && (
        <div className="hover">
          <img src={image} alt="preview" />
          <div className="info">
            <h3>{title}</h3>
            {extraInfo && <p>{extraInfo}</p>}
            <div className="icons">
              <IoPlayCircleSharp />
              <RiThumbUpFill />
              <RiThumbDownFill />
              <AiOutlinePlus />
              <BiChevronDown />
            </div>
          </div>
        </div>
      )}
    </Container>
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

  .hover {
    position: absolute;
    top: -10rem;
    left: -3rem;
    z-index: 10;
    width: 300px;
    background-color: #181818;
    border-radius: 0.3rem;
    padding: 1rem;
    box-shadow: 0 0 10px rgba(0,0,0,0.8);

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
        color: #fff;
        margin-top: 0.5rem;

        svg {
          font-size: 1.2rem;
          cursor: pointer;

          &:hover {
            color: #999;
          }
        }
      }
    }
  }
`;
