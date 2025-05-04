import { Router } from "express";

// Import route handlers (controllers)
import {
    getHomePageInfo,
    getAtoZAnimeList,
    getSearchPageInfo,
    getAnimeDetails,
    getCategoryPageInfo,
    getEpisodesInfo,
    getEpisodeServersInfo,
    getEpisodeStreamingSourceInfo,
    getLatestEpisodes
  } from "../../controllers";


// create a new router just for /aniwatchtv so it’s cleaner
const aniwatchRouter = Router();

/**
 * This router handles everything under /aniwatchtv.
 * By the time a request reaches here, the base path "/aniwatchtv" is already removed.
 * For example:
 * - A request to GET /aniwatchtv/search will match .get("/search")
 * - A request to GET /aniwatchtv/anime/123 will match .get("/anime/:id")
 * Each route here is connected to a controller function that handles the logic and response.
 */

// Homepage
aniwatchRouter.get("/", getHomePageInfo);

// A-Z Anime List
aniwatchRouter.get("/az-list", getAtoZAnimeList);

// Search
aniwatchRouter.get("/search", getSearchPageInfo);

// Anime Details
aniwatchRouter.get("/anime/:id", getAnimeDetails);

// Episodes List
aniwatchRouter.get("/episodes/:id", getEpisodesInfo);

// Server List for Episode
aniwatchRouter.get("/servers", getEpisodeServersInfo);

// Streaming Source (Video URL)
aniwatchRouter.get("/episode-srcs", getEpisodeStreamingSourceInfo);

// Browse by Category (e.g., /aniwatchtv/action?page=2)
aniwatchRouter.get("/:category", getCategoryPageInfo);

aniwatchRouter.get("/latest", getLatestEpisodes);

export default aniwatchRouter;
