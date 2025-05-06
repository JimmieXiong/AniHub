import { getAniWatchTVUrls } from "../utils/aniwatchtvRoutes";
import { headers } from "../config/headers";
import axios, { AxiosError } from "axios";
import { load, type CheerioAPI } from "cheerio";
import createHttpError from "http-errors";

import {
  extractAnimeDetails,
  extractExtraAboutInfo,
  extractAnimeSeasonsInfo,
  extractRelatedAnimes,
  extractRecommendedAnimes,
  extractMostPopularAnimes,
} from "../extractors";

import { ScrapedAboutPage, AboutAnimeInfo } from "../types/animeTypes";
import { detectCountry } from "../utils/detectCountry";

export const scrapeAnimeDetails = async (
  id: string
): Promise<ScrapedAboutPage & { origin?: "Japan" | "China" | "Unknown" }> => {
  const defaultInfo: AboutAnimeInfo = {
    id: null,
    mal_id: null,
    al_id: null,
    anime_id: null,
    name: "UNKNOWN ANIME",
    img: null,
    rating: null,
    episodes: {
      eps: null,
      sub: null,
      dub: null,
    },
    category: null,
    quality: null,
    duration: null,
    description: "UNKNOWN ANIME DESCRIPTION",
  };

  const result: ScrapedAboutPage & { origin?: "Japan" | "China" | "Unknown" } = {
    info: defaultInfo,
    moreInfo: {},
    seasons: [],
    relatedAnimes: [],
    recommendedAnimes: [],
    mostPopularAnimes: [],
  };

  try {
    const { BASE } = await getAniWatchTVUrls();
    const url = new URL(id, BASE).toString();

    const response = await axios.get(url, {
      headers: headers,
    });

    const $: CheerioAPI = load(response.data);

    result.info = extractAnimeDetails($, "#ani_detail .container .anis-content");
    result.moreInfo = extractExtraAboutInfo($, "#ani_detail .container .anis-content .anisc-info");
    result.seasons = extractAnimeSeasonsInfo($, ".os-list a.os-item");
    result.relatedAnimes = extractRelatedAnimes(
      $,
      "#main-sidebar .block_area.block_area_sidebar.block_area-realtime:nth-of-type(1) .anif-block-ul ul li"
    );
    result.recommendedAnimes = extractRecommendedAnimes(
      $,
      "#main-content .block_area.block_area_category .tab-content .flw-item"
    );
    result.mostPopularAnimes = extractMostPopularAnimes(
      $,
      "#main-sidebar .block_area.block_area_sidebar.block_area-realtime:nth-of-type(2) .anif-block-ul ul li"
    );

    const studiosRaw = result.moreInfo["Studios:"];
    const studios =
      typeof studiosRaw === "string"
        ? studiosRaw.split(",").map((s) => s.trim())
        : [];

    result.origin = detectCountry(studios);

    console.log("Studios:", studios);
    console.log("Detected Origin:", result.origin);

    return result;
  } catch (err) {
    console.error("Error in scrapeAnimeDetails:", err);

    if (err instanceof AxiosError) {
      throw createHttpError(
        err?.response?.status || 500,
        err?.response?.statusText || "Something went wrong"
      );
    }

    throw createHttpError.InternalServerError("Internal server error");
  }
};
