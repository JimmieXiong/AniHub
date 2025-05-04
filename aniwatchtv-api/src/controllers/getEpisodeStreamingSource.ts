import type { RequestHandler } from "express";
import axios from "axios";
import { load, type CheerioAPI } from "cheerio";
import createHttpError from "http-errors";

import { scrapeStreamingSourceFromMegaCloud } from "../scrapers/scrapeStreamingSourceFromMegaCloud";
import { getAniWatchTVUrls } from "../utils/aniwatchtvRoutes";
import { headers } from "../config/headers"; // ✅ fixed import

type AnilistID = number | null;
type MalID = number | null;

/**
 * GET /aniwatchtv/episode/source?id=...&category=sub
 * Fetches video stream sources + AniList/MAL ID metadata.
 */
const getEpisodeStreamingSourceInfo: RequestHandler = async (req, res) => {
  try {
    const episodeId = req.query.id
      ? decodeURIComponent(req.query.id as string)
      : null;

    const category = (req.query.category
      ? decodeURIComponent(req.query.category as string)
      : "sub") as "sub" | "dub" | "raw";

    if (!episodeId) {
      throw createHttpError.BadRequest("Episode ID is required");
    }

    const aniwatchUrls = await getAniWatchTVUrls();

    // 🎥 Get stream info
    const streamingData = await scrapeStreamingSourceFromMegaCloud(episodeId, category);

    // 🧠 Extract AniList & MAL IDs
    const animePageUrl = new URL(episodeId.split("?ep=")[0], aniwatchUrls.BASE).href;
    const animePage = await axios.get(animePageUrl, {
      headers: {
        ...headers, // ✅ fixed usage
        Referer: aniwatchUrls.BASE,
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    const $: CheerioAPI = load(animePage.data);
    const syncDataText = $("#syncData").text();

    let malID: MalID = null;
    let anilistID: AnilistID = null;

    try {
      const syncData = JSON.parse(syncDataText);
      malID = Number(syncData?.mal_id) || null;
      anilistID = Number(syncData?.anilist_id) || null;
    } catch {
      // fallback to null
    }

    res.status(200).json({
      ...streamingData,
      anilistID,
      malID,
    });
  } catch (err) {
    console.error("❌ Error in getEpisodeStreamingSourceInfo:", err);
    res.status(500).json({ error: "Failed to fetch episode source data" });
  }
};

export { getEpisodeStreamingSourceInfo };
