import { getAniWatchTVUrls } from "../utils/aniwatchtvRoutes";
import { headers } from "../config/headers";
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
    const [animeId, query] = episodeUrl.split("?");
    const searchParams = new URLSearchParams(query);
    const episodeId = searchParams.get("ep");

    if (!episodeId) {
      throw createHttpError.BadRequest("Missing 'ep' parameter");
    }

    const { BASE, AJAX } = await getAniWatchTVUrls();
    const targetUrl = `${AJAX}/v2/episode/servers?episodeId=${episodeId}`;

    const response = await axios.get(targetUrl, {
      headers: {
        ...headers,
        "X-Requested-With": "XMLHttpRequest",
        Referer: `${BASE}/watch/${animeId}?ep=${episodeId}`, 
      },
    });

    if (!response.data?.html || typeof response.data.html !== "string") {
      throw createHttpError(500, "Invalid response: expected HTML string");
    }

    const $: CheerioAPI = load(response.data.html);

    const episodeNumberSelector: SelectorType = ".server-notice strong";
    const epText = $(episodeNumberSelector).text().trim();
    result.episodeNo = Number(epText.split(" ").pop()) || 0;

    const extractServers = (selector: string) =>
      $(selector)
        .map((_i, el) => ({
          serverName: $(el).find("a").text().toLowerCase().trim(),
          serverId: Number($(el).attr("data-server-id")?.trim()) || null,
        }))
        .get();

    result.sub = extractServers(".servers-sub .ps__-list .server-item");
    result.dub = extractServers(".servers-dub .ps__-list .server-item");
    result.raw = extractServers(".servers-raw .ps__-list .server-item");

    return result;
  } catch (err: any) {
    console.error("Error in scrapeEpisodeServerList:", err);

    if (err instanceof AxiosError) {
      throw createHttpError(
        err.response?.status || 500,
        err.response?.statusText || "Something went wrong"
      );
    }

    throw createHttpError.InternalServerError("Internal server error while scraping episode servers");
  }
};
