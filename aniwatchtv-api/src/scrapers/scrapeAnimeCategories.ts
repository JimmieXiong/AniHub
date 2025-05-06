import axios, { AxiosError } from "axios";
import { load, type CheerioAPI, type SelectorType } from "cheerio";
import createHttpError, { type HttpError } from "http-errors";

import { getAniWatchTVUrls } from "../utils/aniwatchtvRoutes";
import { headers } from "../config/headers"; 
import {
  extractCategoryAnimes,
  extractGenreList,
  extractTop10Animes,
} from "../extractors";

import { type ScrapedCategoryPage } from "../types/animeTypes";

export const scrapeAnimeCategories = async (
  category: string,
  page: number,
): Promise<ScrapedCategoryPage | HttpError> => {
  const result: ScrapedCategoryPage = {
    animes: [],
    top10Animes: {
      day: [],
      week: [],
      month: [],
    },
    category,
    genres: [],
    currentPage: Number(page),
    hasNextPage: false,
    totalPages: 1,
  };

  try {
    const { BASE } = await getAniWatchTVUrls();

    const isFirstPage = page === 1;
    const fixedCategory = category === "latest" ? "recently-updated" : category;
    const url = isFirstPage
      ? `${BASE}/${fixedCategory}`
      : `${BASE}/${fixedCategory}?page=${page}`;

    console.log(`Fetching URL: ${url}`);

    const response = await axios.get(url, {
      headers: headers, 
    });
    
    // Debugging the raw HTML response
    console.log("HTML Preview:", response.data.slice(0, 500)); 
    

    const $: CheerioAPI = load(response.data);

    const animeSelector: SelectorType =
      category === "latest"
        ? ".film_list-wrap .flw-item"
        : "#main-content .tab-content .film_list-wrap .flw-item";

        console.log("Found anime count:", $(animeSelector).length); // This will show how many anime items are found by the selector

    const categorySelector: SelectorType =
      "#main-content .block_area .block_area-header .cat-heading";
    const top10Selector: SelectorType =
      '#main-sidebar .block_area-realtime [id^="top-viewed-"]';
    const genreSelector: SelectorType =
      "#main-sidebar .block_area.block_area_sidebar.block_area-genres .sb-genre-list li";

    result.category = $(categorySelector)?.text()?.trim() || category;
    result.animes = extractCategoryAnimes($, animeSelector);
    console.log("Extracted Animes:", result.animes); // Log the animes extracted

    result.genres = extractGenreList($, genreSelector);

    const $pagination = $(".pagination > li");
    if ($pagination.length > 0) {
      const isLastActive = $(".pagination > li").last().hasClass("active");
      result.hasNextPage = !isLastActive;

      const lastPageNumber =
        $('.pagination > .page-item a[title="Last"]').attr("href")?.split("=")?.pop() ??
        $('.pagination > .page-item a[title="Next"]').attr("href")?.split("=")?.pop() ??
        $(".pagination > .page-item.active a").text()?.trim();

      result.totalPages = Number(lastPageNumber) || 1;
    }

    if (result.animes.length === 0 && !result.hasNextPage) {
      result.totalPages = 0;
    }

    $(top10Selector).each((_i, el) => {
      const type = $(el).attr("id")?.split("-")?.pop()?.trim();
      if (!type) return;

      if (type === "day") result.top10Animes.day = extractTop10Animes($, type);
      if (type === "week") result.top10Animes.week = extractTop10Animes($, type);
      if (type === "month") result.top10Animes.month = extractTop10Animes($, type);
    });

    return result;
  } catch (err) {
    console.error("scrapeAnimeCategories error:", err);

    if (err instanceof AxiosError) {
      throw createHttpError(
        err.response?.status || 500,
        err.response?.statusText || "Something went wrong"
      );
    }

    throw createHttpError.InternalServerError("Internal server error");
  }
};

export default scrapeAnimeCategories;
