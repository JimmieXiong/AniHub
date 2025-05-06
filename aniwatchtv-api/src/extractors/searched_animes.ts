import type { CheerioAPI, SelectorType } from "cheerio";
import createHttpError from "http-errors";
import { AxiosError } from "axios";
import { extractTopUpcomingAnimes } from "./top_upcoming_animes";

export const extractSearchedAnimes = (
  $: CheerioAPI,
  selectors: SelectorType,
) => {
  try {
    const animes = extractTopUpcomingAnimes($, selectors);

    return animes;
  } catch (err) {
    console.error("Error in extract_searched_animes :", err);

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
