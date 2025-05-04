import type { CheerioAPI, SelectorType } from "cheerio";
import createHttpError from "http-errors";
import { AxiosError } from "axios";
import { extractTopUpcomingAnimes } from "./top_upcoming_animes";
import { RecommendedAnime } from "../types/animeTypes";

export const extractRecommendedAnimes = (
  $: CheerioAPI,
  selectors: SelectorType,
): RecommendedAnime[] => {
  try {
    const animes: RecommendedAnime[] = extractTopUpcomingAnimes(
      $,
      selectors,
    );

    return animes;
  } catch (err) {
    ////////////////////////////////////////////////////////////////
    console.error("Error in extract_recommended_animes :", err); // for TESTING//
    ////////////////////////////////////////////////////////////////

    if (err instanceof AxiosError) {
      throw createHttpError(
        err?.response?.status || 500,
        err?.response?.statusText || "Something went wrong",
      );
    } else {
      throw createHttpError.InternalServerError("Internal server error");
    }
  }
};
