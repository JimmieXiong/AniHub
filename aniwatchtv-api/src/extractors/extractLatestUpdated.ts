import { load, type CheerioAPI } from "cheerio";
import type { LatestAnimeEpisode } from "../types/animeTypes";
import { getAniWatchTVUrls } from "../utils/aniwatchtvRoutes";
import { headers } from "../config/headers"; // ✅ fixed import
import axios from "axios";

export default async function extractLatestUpdated(page = 1): Promise<LatestAnimeEpisode[]> {
  try {
    const { BASE } = await getAniWatchTVUrls();
    const url =
      page === 1 ? `${BASE}/recently-updated` : `${BASE}/recently-updated?page=${page}`;

    console.log(`📥 Fetching URL: ${url}`);

    const res = await axios.get(url, {
      headers: {
        ...headers, // ✅ fixed usage
        Referer: BASE,
      },
    });

    if (res.status === 404 || res.data.includes("Oops! We can't find this page")) {
      console.warn(`⚠️ 404 page or empty page for URL: ${url}`);
      return [];
    }

    const $: CheerioAPI = load(res.data);
    const list: LatestAnimeEpisode[] = [];

    $(".film_list-wrap .flw-item").each((_, el) => {
      const name = $(el).find(".film-name a").text().trim();
      const href = $(el).find("a").attr("href") || "";
      const id = href.includes("/watch/")
        ? href.split("/watch/")[1]?.split("?")[0]?.trim()
        : href.split("/").pop()?.trim() || null;

      const img =
        $(el).find("img").attr("data-src")?.trim() ||
        $(el).find("img").attr("src")?.trim() ||
        null;

      const epsText = $(el).find(".tick-eps").text().replace("Ep", "").trim();
      const eps = epsText ? parseInt(epsText) : null;

      const sub = $(el).find(".tick-sub").length > 0;
      const dub = $(el).find(".tick-dub").length > 0;

      if (id && name && img) {
        list.push({
          id,
          name,
          img,
          episodes: { eps, sub: sub ? 1 : 0, dub: dub ? 1 : 0 },
          duration: null,
          rated: false,
        });
      }
    });

    return list;
  } catch (err: any) {
    console.error("❌ Failed to extract latest episodes:", err.message || err);
    throw err;
  }
}
