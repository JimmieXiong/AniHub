import axios from "axios";
import { load } from "cheerio";
import { MinimalAnime } from "../types/animeTypes";
import { headers } from "../config/headers";
import createHttpError from "http-errors";
import { AxiosError } from "axios";

const BASE_URL = "https://aniwatchtv.to";

export const scrapeTrendingAnimes = async (): Promise<MinimalAnime[]> => {
  try {
    console.log(`🟡 Fetching homepage: ${BASE_URL}`);
    const res = await axios.get(BASE_URL, {
      headers: {
        "User-Agent": headers.USER_AGENT_HEADER,
        Accept: headers.ACCEPT_HEADER,
        "Accept-Encoding": headers.ACCEPT_ENCODEING_HEADER,
      },
    });

    const $ = load(res.data);
    const trendingElems = $("#anime-trending #trending-home .swiper-wrapper .swiper-slide");

    const animes: MinimalAnime[] = [];

    trendingElems.each((_i, el) => {
      const id =
        $(el).find(".dynamic-name").attr("href")?.replace("/", "").trim() || null;
      const name =
        $(el).find(".dynamic-name").text().trim() || "UNKNOWN ANIME";
      const img =
        $(el).find(".film-poster-img").attr("data-src")?.trim() || null;

      if (id && name && img) {
        animes.push({ id, name, img });
      }
    });

    console.log(`✅ Trending (${animes.length}):`);
    animes.forEach((a, i) => console.log(`${i + 1}. ${a.name} (${a.id})`));

    return animes;
  } catch (err) {
    console.error("❌ Error scraping trending:", err);
    if (err instanceof AxiosError) {
      throw createHttpError(
        err.response?.status || 500,
        err.response?.statusText || "Something went wrong"
      );
    }
    throw createHttpError.InternalServerError("Internal server error");
  }
};
