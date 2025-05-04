import React, { useRef } from "react";
import styled from "styled-components";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Card from "./Card";

export default function CardSlider({ data = [], title = "" }) {
  const listRef = useRef();
  const itemWidth = 180;
  const visibleItems = Math.floor(window.innerWidth / itemWidth);
  const maxScrollIndex = Math.max(0, data.length - visibleItems);

  let scrollIndex = 0;

  const scroll = (direction) => {
    if (!listRef.current) return;
    const scrollAmount = itemWidth * visibleItems;

    if (direction === "left" && scrollIndex > 0) {
      scrollIndex--;
    } else if (direction === "right" && scrollIndex < maxScrollIndex) {
      scrollIndex++;
    }

    listRef.current.style.transform = `translateX(-${scrollIndex * scrollAmount}px)`;
  };

  return (
    <SliderContainer>
      <h2>{title}</h2>
      <div className="slider-wrapper">
        {data.length > visibleItems && (
          <button className="arrow left" onClick={() => scroll("left")}>
            <AiOutlineLeft />
          </button>
        )}
        <div className="slider" ref={listRef}>
          {data.map((anime, idx) => (
            <Card key={idx} anime={anime} index={idx} />
          ))}
        </div>
        {data.length > visibleItems && (
          <button className="arrow right" onClick={() => scroll("right")}>
            <AiOutlineRight />
          </button>
        )}
      </div>
    </SliderContainer>
  );
}

const SliderContainer = styled.div`
  padding: 1rem 2rem;
  h2 {
    color: white;
    margin-bottom: 1rem;
  }

  .slider-wrapper {
    position: relative;

    .arrow {
      position: absolute;
      top: 35%;
      z-index: 20;
      background: rgba(0, 0, 0, 0.6);
      border: none;
      color: white;
      font-size: 2rem;
      padding: 0.2rem;
      cursor: pointer;
    }

    .left {
      left: 0;
    }

    .right {
      right: 0;
    }

    .slider {
      display: flex;
      gap: 1rem;
      overflow: hidden;
      transition: transform 0.3s ease-in-out;
    }
  }
`;
