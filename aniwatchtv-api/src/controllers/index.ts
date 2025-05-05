import { getHomePageInfo } from "./getHomePage"; 
import { getAnimeDetails } from "./getAnimeDetails";
import { getSearchPageInfo } from "./getSearchPage";
import { getCategoryPageInfo } from "./getCategoryPage";
import { getEpisodesInfo } from "./getEpisodesInfo";
import { getEpisodeServersInfo } from "./getEpisodeServers";
import { getEpisodeStreamingSourceInfo } from "./getEpisodeStreamingSource";
import { getAtoZAnimeList } from "./getAtoZAnimeList";
import { getLatestEpisodes } from "./getLatestEpisodes";

// This index file gathers and re-exports all the controller functions
// so they can be easily imported from a single location.
// Instead of importing each function from its own file,
// we can now import everything from "../controllers" directly.
// For example:
// import { getSearchPageInfo } from "../controllers";
// instead of:
// import { getSearchPageInfo } from "../controllers/getSearchPage";


export {
  getHomePageInfo,
  getAnimeDetails,
  getSearchPageInfo,
  getCategoryPageInfo,
  getEpisodesInfo,
  getEpisodeServersInfo,
  getEpisodeStreamingSourceInfo,
  getAtoZAnimeList,
  getLatestEpisodes,
};
