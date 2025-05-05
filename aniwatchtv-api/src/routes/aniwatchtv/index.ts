import { Router } from "express";

import {
  getHomePageInfo,
  getAtoZAnimeList,
  getSearchPageInfo,
  getAnimeDetails,
  getCategoryPageInfo,
  getEpisodesInfo,
  getEpisodeServersInfo,
  getEpisodeStreamingSourceInfo,
  getLatestEpisodes,
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

aniwatchRouter.get("/", getHomePageInfo);

aniwatchRouter.get("/az-list", getAtoZAnimeList);

aniwatchRouter.get("/search", getSearchPageInfo);

aniwatchRouter.get("/anime/:id", getAnimeDetails);

aniwatchRouter.get("/episodes/:id", getEpisodesInfo);

aniwatchRouter.get("/servers", getEpisodeServersInfo);

aniwatchRouter.get("/episode-srcs", getEpisodeStreamingSourceInfo);

aniwatchRouter.get("/latest", getLatestEpisodes);

aniwatchRouter.get("/:category", getCategoryPageInfo);


export default aniwatchRouter;
