import { SearchedAnime, MostPopularAnime } from "./animeTypes";

export interface ScrapedSearchPage {
  animes: SearchedAnime[];
  mostPopularAnimes: MostPopularAnime[];
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
  genres: string[];
}
