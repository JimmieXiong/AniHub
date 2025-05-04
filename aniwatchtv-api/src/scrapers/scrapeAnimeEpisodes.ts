import axios, { AxiosError } from "axios";
import { load, type CheerioAPI, type SelectorType } from "cheerio";
import createHttpError, { type HttpError } from "http-errors";

import { getAniWatchTVUrls } from "../utils/aniwatchtvRoutes";
import { headers } from "../config/headers"; // ✅ fixed import
import { extractEpisodeList } from "../extractors";
import { type ScrapedEpisodesPage } from "../types/animeTypes";

export const scrapeAnimeEpisodes = async (
  animeId: string
): Promise<ScrapedEpisodesPage | HttpError> => {
  const result: ScrapedEpisodesPage = {
    totalEpisodes: 0,
    episodes: [],
  };

  try {
    const { BASE, AJAX } = await getAniWatchTVUrls();
    const cleanId = animeId.split("-").pop();

    const response = await axios.get(`${AJAX}/v2/episode/list/${cleanId}`, {
      headers: {
        ...headers, // ✅ use constant randomized headers
        "X-Requested-With": "XMLHttpRequest",
        Referer: `${BASE}/watch/${animeId}`,
      },
    });

    const $: CheerioAPI = load(response.data.html);
    const selector: SelectorType = ".detail-infor-content .ss-list a";

    result.totalEpisodes = $(selector).length;
    result.episodes = extractEpisodeList($, selector);

    return result;
  } catch (err) {
    console.error("❌ Error in scrapeEpisodesPage:", err);

    if (err instanceof AxiosError) {
      throw createHttpError(
        err.response?.status || 500,
        err.response?.statusText || "Something went wrong"
      );
    }

    throw createHttpError.InternalServerError("Internal server error");
  }
};
