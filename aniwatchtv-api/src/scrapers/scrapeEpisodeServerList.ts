import { getAniWatchTVUrls } from "../utils/aniwatchtvRoutes";
import { headers } from "../config/headers"; // ✅ fixed import
import axios, { AxiosError } from "axios";
import createHttpError, { type HttpError } from "http-errors";
import { load, type CheerioAPI, type SelectorType } from "cheerio";
import type { ScrapedEpisodeServer } from "../types/animeTypes";

export const scrapeEpisodeServerList = async (
  episodeUrl: string
): Promise<ScrapedEpisodeServer | HttpError> => {
  const result: ScrapedEpisodeServer = {
    episodeId: episodeUrl,
    episodeNo: 0,
    sub: [],
    dub: [],
    raw: [],
  };

  try {
    const episodeId = episodeUrl.split("?ep=")[1];
    const aniwatchUrls = await getAniWatchTVUrls();

    const { data } = await axios.get(
      `${aniwatchUrls.AJAX}/v2/episode/servers?episodeId=${episodeId}`,
      {
        headers: {
          ...headers, // ✅ use constant headers
          "X-Requested-With": "XMLHttpRequest",
          Referer: new URL(`/watch/${episodeUrl}`, aniwatchUrls.BASE).href,
        },
      }
    );

    const $: CheerioAPI = load(data.html);

    // Extract episode number
    const episodeNumberSelector: SelectorType = ".server-notice strong";
    result.episodeNo = Number($(episodeNumberSelector).text().split(" ").pop()) || 0;

    // Extract server lists
    const extractServers = (selector: string) =>
      $(selector)
        .map((_, el) => ({
          serverName: $(el).find("a").text().toLowerCase().trim(),
          serverId: Number($(el).attr("data-server-id")?.trim()) || null,
        }))
        .get();

    result.sub = extractServers(".servers-sub .ps__-list .server-item");
    result.dub = extractServers(".servers-dub .ps__-list .server-item");
    result.raw = extractServers(".servers-raw .ps__-list .server-item");

    return result;
  } catch (err: any) {
    console.error("❌ Error in scrapeEpisodeServerList:", err);

    if (err instanceof AxiosError) {
      throw createHttpError(
        err.response?.status || 500,
        err.response?.statusText || "Something went wrong"
      );
    }

    throw createHttpError.InternalServerError("Internal server error");
  }
};
