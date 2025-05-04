import {
    AboutAnimeInfo,
    ExtraAboutAnimeInfo,
    AnimeSeasonsInfo,
    RelatedAnime,
    RecommendedAnime,
    MostPopularAnime,
  } from "./animeTypes";
  
  export interface ScrapedAboutPage {
    info: AboutAnimeInfo;
    moreInfo: ExtraAboutAnimeInfo;
    seasons: AnimeSeasonsInfo[];
    relatedAnimes: RelatedAnime[];
    recommendedAnimes: RecommendedAnime[];
    mostPopularAnimes: MostPopularAnime[];
  }
  