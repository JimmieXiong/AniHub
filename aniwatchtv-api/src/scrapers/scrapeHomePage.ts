import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { load, type CheerioAPI, type SelectorType } from "cheerio";
import createHttpError, { type HttpError } from "http-errors";
import { getAniWatchTVUrls } from "../utils/aniwatchtvRoutes";
import { headers } from "../config/headers"; // ✅ fixed
import {
  extractTrendingAnimes,
  extractLatestEpisodes,
  extractFeaturedAnimes,
  extractTopUpcomingAnimes,
  extractSpotlightAnimes,
  extractGenreList,
  extractTop10Animes,
} from "../extractors";
import {
  ScrapedHomePage,
  Top10AnimeTimePeriod,
} from "../types/animeTypes";
import axios, { AxiosError } from "axios";

puppeteer.use(StealthPlugin());

export const scrapeHomePage = async (): Promise<ScrapedHomePage | HttpError> => {
  const result: ScrapedHomePage = {
    spotLightAnimes: [],
    trendingAnimes: [],
    latestEpisodes: [],
    top10Animes: { day: [], week: [], month: [] },
    featuredAnimes: {
      topAiringAnimes: [],
      mostPopularAnimes: [],
      mostFavoriteAnimes: [],
      latestCompletedAnimes: [],
    },
    topUpcomingAnimes: [],
    genres: [],
  };

  try {
    // Get the URLs from the utility function
    const { HOME } = await getAniWatchTVUrls();

    // Fetch the main page using axios
    const mainPage = await axios.get(HOME, {
      headers: {
        "User-Agent": headers.USER_AGENT_HEADER,
        "Accept-Encoding": headers.ACCEPT_ENCODEING_HEADER,
        Accept: headers.ACCEPT_HEADER,
      },
    });

    const $: CheerioAPI = load(mainPage.data);

    // Define the CSS selectors for scraping
    const trendingAnimeSelectors: SelectorType =
      "#anime-trending #trending-home .swiper-wrapper .swiper-slide";
    const top10Selectors: SelectorType =
      '#main-sidebar .block_area-realtime [id^="top-viewed-"]';
    const latestEpisodesSelectors: SelectorType =
      "#main-content .block_area_home:nth-of-type(1) .tab-content .film_list-wrap .flw-item";
    const topAiringSelectors: SelectorType =
      "#anime-featured .row div:nth-of-type(1) .anif-block-ul ul li";
    const mostPopularSelectors: SelectorType =
      "#anime-featured .row div:nth-of-type(2) .anif-block-ul ul li";
    const mostFavoriteSelectors: SelectorType =
      "#anime-featured .row div:nth-of-type(3) .anif-block-ul ul li";
    const latestCompletedSelectors: SelectorType =
      "#anime-featured .row div:nth-of-type(4) .anif-block-ul ul li";
    const topUpcomingSelectors: SelectorType =
      "#main-content .block_area_home:nth-of-type(3) .tab-content .film_list-wrap .flw-item";
    const spotLightSelectors: SelectorType =
      "#slider .swiper-wrapper .swiper-slide";
    const genresSelectors: SelectorType =
      "#main-sidebar .block_area.block_area_sidebar.block_area-genres .sb-genre-list li";

    // Scrape the various sections
    result.trendingAnimes = extractTrendingAnimes($, trendingAnimeSelectors);
    result.latestEpisodes = extractLatestEpisodes($, latestEpisodesSelectors);

    result.featuredAnimes.topAiringAnimes = extractFeaturedAnimes(
      $,
      topAiringSelectors
    );
    result.featuredAnimes.mostPopularAnimes = extractFeaturedAnimes(
      $,
      mostPopularSelectors
    );
    result.featuredAnimes.mostFavoriteAnimes = extractFeaturedAnimes(
      $,
      mostFavoriteSelectors
    );
    result.featuredAnimes.latestCompletedAnimes = extractFeaturedAnimes(
      $,
      latestCompletedSelectors
    );

    result.topUpcomingAnimes = extractTopUpcomingAnimes($, topUpcomingSelectors);
    result.spotLightAnimes = extractSpotlightAnimes($, spotLightSelectors);
    result.genres = extractGenreList($, genresSelectors);

    // Extract top 10 animes for each period
    $(top10Selectors).each((_index, element) => {
      const periodType = $(element)
        .attr("id")
        ?.split("-")
        ?.pop()
        ?.trim() as Top10AnimeTimePeriod;
      if (periodType === "day") {
        result.top10Animes.day = extractTop10Animes($, periodType);
        return;
      }
      if (periodType === "week") {
        result.top10Animes.week = extractTop10Animes($, periodType);
        return;
      }
      if (periodType === "month") {
        result.top10Animes.month = extractTop10Animes($, periodType);
      }
    });

    return result;
  } catch (err) {
    console.error("❌ scrapeHomePage failed:", err);
    if (err instanceof AxiosError) {
      throw createHttpError(
        err?.response?.status || 500,
        err?.response?.statusText || "Something went wrong"
      );
    }
    throw createHttpError.InternalServerError("Internal server error");
  }
};
