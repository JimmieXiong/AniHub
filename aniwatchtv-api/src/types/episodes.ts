import { Episode } from "./animeTypes";

export interface ScrapedEpisodesPage {
  totalEpisodes: number;
  episodes: Episode[];
}
