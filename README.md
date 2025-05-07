# AniHub 
**A Full-Stack Anime & Donghua Streaming Platform**

AniHub is a full-stack web application that offers a centralized streaming experience for both Japanese anime and Chinese donghua. Inspired by platforms like KissAnime, AniWatchTV and similar platforms.

AniHub aggregates content from third-party sources and delivers it through a clean, responsive user interface.

**Educational Use Only:** This project was developed as a capstone for academic purposes. It is not intended for public distribution or commercial use.

---

## Features

- **Search & Browse**: Instantly explore anime and donghua by name, genre, or origin (Japan/China).
- **Episode Streaming**: Stream decrypted MegaCloud videos via external players (e.g. VLC).
- **My List**: Save shows to your personalized watchlist using Firestore.
- **Premium Access**: Subscribe via Stripe to unlock exclusive features like Movies and full episode access.
- **Origin Filtering**: Filter anime based on country of origin for tailored browsing. (No playback/nor anime detail If more time will implement fix)
- **Auth & Role Management**: Secure Firebase Authentication with Firestore user roles (free vs premium).

---

## Tech Stack

### Frontend:
- **React** (with hooks & functional components)
- **Styled-Components** (for styling)
- **Axios** (for HTTP requests)
- **React Router DOM** (for protected/public routing)

### Backend:
- **Node.js** + **Express**
- **TypeScript** for backend logic and route typing
- **Cheerio** + **Axios** (for scraping AniWatchTV)
- **Firebase Admin SDK** (for secure user role management)
- **Stripe** (for subscription payments)

### Cloud Services:
- **Firebase Authentication** – user registration/login
- **Firestore** – stores user data, My List, and premium status

---

## API Used

AniHub uses a modified version of [falcon71181's Anime-API](https://github.com/falcon71181/Anime-API), a scraping backend that pulls metadata, episodes, and streaming sources from **AniWatchTV**.

### API Functionality:
- `/aniwatchtv` – Featured, Latest, Trending
- `/aniwatchtv/search` – Search by title
- `/aniwatchtv/anime-details` – Series metadata
- `/aniwatchtv/episodes` – Episode list
- `/aniwatchtv/episode-srcs` – Decrypted MegaCloud video URL
- `/aniwatchtv/movie` – Premium movies by page
- `/aniwatchtv/latest` – Recently updated episodes

---

## What I Learned

Working on AniHub gave me real insight into:
- How real anime streaming platforms (AniWatchTV, KissAnime, etc.) structure and deliver content
- How to build full-stack apps with clean separation between frontend/backend
- Implementing **basic route protection**, **premium gating**, and **secure API integration**
- Managing async scraping, pagination, and user-specific content
- **Debugging... a lot. A LOT.** Seriously, I now speak “console.log()” 

---

## Developer

**Jimmie Xiong**  
B.S. in Computer Science  
Metropolitan State University 2025

This capstone was built (SOLO), late nights, and lots of caffeine.

---

## Disclaimer

AniHub is a student project. It does not host or own any video content. All data is scraped for educational purposes only. Please respect the original content creators and streaming providers.

---