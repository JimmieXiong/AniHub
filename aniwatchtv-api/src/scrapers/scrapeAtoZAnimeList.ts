import axios, { AxiosError } from "axios";
import { load, type CheerioAPI, type SelectorType } from "cheerio";
import createHttpError, { type HttpError } from "http-errors";

import { getAniWatchTVUrls } from "../utils/aniwatchtvRoutes";
import { headers } from "../config/headers"; // ✅ fixed import
import { extractAtoZAnimes } from "../extractors";
import { type Anime } from "../types/animeTypes";

/**
 * Scrapes anime list from the A-Z page for a given pagination.
 */
export const scrapeAtoZAnimeList = async (page: number): Promise<Anime[] | HttpError> => {
  try {
    const { BASE } = await getAniWatchTVUrls();
    const pageUrl = new URL(`az-list/?page=${page}`, BASE).toString();

    const response = await axios.get(pageUrl, {
      headers, 
    });

    const $: CheerioAPI = load(response.data);

    const selector: SelectorType = ".film_list-wrap .flw-item";
    console.log("Elements matched:", $(selector).length);
    console.log("HTML preview:", response.data.slice(0, 500)); // optional

    return extractAtoZAnimes($, selector);
  } catch (err) {
    console.error("Error in scrapeAtoZAnimeList:", err);

    if (err instanceof AxiosError) {
      throw createHttpError(
        err.response?.status || 500,
        err.response?.statusText || "Something went wrong"
      );
    }

    throw createHttpError.InternalServerError("Internal server error");
  }
};
