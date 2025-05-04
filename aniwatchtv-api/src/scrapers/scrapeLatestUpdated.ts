import axios from "axios";
import { load } from "cheerio";
import { getAniWatchTVUrls } from "../utils/aniwatchtvRoutes";
import { headers } from "../config/headers";
import type { LatestAnimeEpisode } from "../types/animeTypes";

/**
 * Scrapes latest updated anime from AniWatchTV
 * @param page Optional page number (defaults to 1)
 */
export const scrapeLatestUpdated = async (page = 1): Promise<LatestAnimeEpisode[]> => {
  try {
    const { BASE } = await getAniWatchTVUrls();
    const url = `${BASE}/recently-updated${page > 1 ? `?page=${page}` : ""}`;

    console.log(`📥 Fetching latest updates from: ${url}`);

    const res = await axios.get(url, {
      headers: {
        ...headers, // ✅ now using static randomized headers
        Referer: BASE,
      },
    });

    const $ = load(res.data);
    const animeList: LatestAnimeEpisode[] = [];

    $(".film_list-wrap .flw-item").each((_, el) => {
      const name = $(el).find(".film-name a").text().trim();
      const id = $(el).find(".film-name a").attr("href")?.split("/").pop() || null;
      const img = $(el).find("img").attr("data-src") || null;
      const eps = parseInt($(el).find(".tick-item.tick-eps").text().replace("Ep", "").trim()) || null;
      const sub = $(el).find(".tick-sub").length ? 1 : 0;
      const dub = $(el).find(".tick-dub").length ? 1 : 0;

      animeList.push({
        id,
        name,
        img,
        episodes: { eps, sub, dub },
        duration: null,
        rated: false,
      });
    });

    return animeList;
  } catch (err) {
    console.error("❌ scrapeLatestUpdated FAILED:", err);
    throw err;
  }
};
