import { type CheerioAPI } from "cheerio";
import createHttpError from "http-errors";
import { AxiosError } from "axios";
import { MostPopularAnime } from "../types/animeTypes";

export const extractMostPopularAnimes = (
  $: CheerioAPI,
  selector: string
): MostPopularAnime[] => {
  try {
    const animes: MostPopularAnime[] = [];

    $(selector).each((_index, element) => {
      const $el = $(element);
      const detailEl = $el.find(".film-detail .dynamic-name");
      const posterEl = $el.find(".film-poster .film-poster-img");
      const infoEl = $el.find(".fd-infor");

      const animeID = detailEl.attr("href")?.slice(1).trim() || null;
      const animeNAME = detailEl.text()?.trim() || "UNKNOWN ANIME";
      const animeIMG = posterEl.attr("data-src")?.trim() || null;

      const epSUB = Number(infoEl.find(".tick-item.tick-sub").text().trim()) || null;
      const epDUB = Number(infoEl.find(".tick-item.tick-dub").text().trim()) || null;
      const total_eps = Number(infoEl.find(".tick-item.tick-eps").text().trim()) || null;

      const animeTYPE =
        infoEl
          .find(".tick")
          .text()
          ?.replace(/[\s\n]+/g, " ")
          ?.trim()
          ?.split(" ")
          ?.pop() || null;

      animes.push({
        id: animeID,
        name: animeNAME,
        category: animeTYPE,
        img: animeIMG,
        episodes: {
          eps: total_eps,
          sub: epSUB,
          dub: epDUB,
        },
      });
    });

    return animes;
  } catch (err) {
    console.error("Error in extractMostPopularAnimes:", err);

    if (err instanceof AxiosError) {
      throw createHttpError(
        err.response?.status || 500,
        err.response?.statusText || "Something went wrong"
      );
    }

    throw createHttpError.InternalServerError("Internal server error");
  }
};
