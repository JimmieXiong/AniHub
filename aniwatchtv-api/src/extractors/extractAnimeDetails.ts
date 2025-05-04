import type { CheerioAPI, SelectorType } from "cheerio";
import createHttpError from "http-errors";
import { AxiosError } from "axios";
import { AboutAnimeInfo } from "../types/animeTypes";

export const extractAnimeDetails = (
  $: CheerioAPI,
  selector: SelectorType
): AboutAnimeInfo => {
  try {
    const syncData = JSON.parse($("#syncData").text() || "{}");
    const anime_id = parseIntSafe(syncData.anime_id);
    const mal_id = parseIntSafe(syncData.mal_id);
    const al_id = parseIntSafe(syncData.anilist_id);

    const animeElement = $(selector);

    const id =
      animeElement.find(".anisc-detail .film-buttons a.btn-play").attr("href")?.split("/")?.pop() ?? null;

    const name =
      animeElement.find(".anisc-detail .film-name.dynamic-name").text().trim() ||
      "UNKNOWN ANIME";

    const img =
      animeElement.find(".film-poster .film-poster-img").attr("src")?.trim() ?? null;

    const rating =
      animeElement.find(".film-stats .tick .tick-pg").text().trim() || null;

    const quality =
      animeElement.find(".film-stats .tick .tick-quality").text().trim() || null;

    const sub =
      Number(animeElement.find(".film-stats .tick .tick-sub").text().trim()) ||
      null;

    const dub =
      Number(animeElement.find(".film-stats .tick .tick-dub").text().trim()) ||
      null;

    const eps =
      Number(animeElement.find(".film-stats .tick .tick-eps").text().trim()) ||
      null;

    const category = animeElement
      .find(".film-stats .tick")
      .text()
      .trim()
      .replace(/[\s\n]+/g, " ")
      .split(" ")
      .at(-2) || null;

    const duration = animeElement
      .find(".film-stats .tick")
      .text()
      .trim()
      .replace(/[\s\n]+/g, " ")
      .split(" ")
      .pop() || null;

      const description =
      animeElement
        .find(".anisc-detail .film-description .text")
        .text()
        ?.split("[")[0]
        ?.trim() || "UNKNOWN ANIME DESCRIPTION";
    
    const info: AboutAnimeInfo = {
      id,
      mal_id,
      anime_id,
      al_id,
      name,
      img,
      rating,
      episodes: {
        eps,
        sub,
        dub,
      },
      category,
      quality,
      duration,
      description,
    };

    return info;
  } catch (err) {
    console.error("Error in extractAnimeDetails:", err);
    if (err instanceof AxiosError) {
      throw createHttpError(
        err?.response?.status || 500,
        err?.response?.statusText || "Something went wrong"
      );
    } else {
      throw createHttpError.InternalServerError("Internal server error");
    }
  }
};

function parseIntSafe(str: string): number | null {
  const parsed = parseInt(str, 10);
  return isNaN(parsed) ? null : parsed;
}
