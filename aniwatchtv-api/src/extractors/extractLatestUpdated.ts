import type { CheerioAPI, SelectorType } from "cheerio";
import { extractTopUpcomingAnimes } from "./index";
import createHttpError from "http-errors";
import { AxiosError } from "axios";
import { LatestAnimeEpisode } from "../types/animeTypes";

export const extractLatestEpisodes = (
  $: CheerioAPI,
  selectors: SelectorType,
): LatestAnimeEpisode[] => {
  try {
    const animes: LatestAnimeEpisode[] = extractTopUpcomingAnimes(
      $,
      selectors,
    );

    return animes;
  } catch (err) {
    console.error("Error in extract_latest_episodes :", err); 

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
