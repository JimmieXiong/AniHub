import { type CheerioAPI } from "cheerio";
import createHttpError from "http-errors";
import { AxiosError } from "axios";
import { MinimalAnime } from "../types/animeTypes";

export const extractTrendingAnimes = (
  $: CheerioAPI,
  selector: string
): MinimalAnime[] => {
  try {
    const animes: MinimalAnime[] = [];

    $(selector).each((_index, element) => {
      const $el = $(element); // scope this element

      const animeID =
        $el.find(".film-poster").attr("href")?.slice(1).trim() || null;

      const animeNAME =
        $el.find(".film-title.dynamic-name").text()?.trim() || "UNKNOWN ANIME";

      const animeIMG =
        $el.find(".film-poster-img").attr("data-src")?.trim() || null;

      // Optional: debug
      // console.log("Trending anime parsed:", { animeID, animeNAME, animeIMG });

      animes.push({
        id: animeID,
        name: animeNAME,
        img: animeIMG,
      });
    });

    return animes;
  } catch (err) {
    console.error("❌ Error in extractTrendingAnimes:", err);

    if (err instanceof AxiosError) {
      throw createHttpError(
        err.response?.status || 500,
        err.response?.statusText || "Something went wrong"
      );
    }

    throw createHttpError.InternalServerError("Internal server error");
  }
};
