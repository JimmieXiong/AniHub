import { scrapeLatestUpdated } from "../scrapers/scrapeLatestUpdated";
import type { RequestHandler } from "express";


/**
 * GET /aniwatchtv/latest?page=1
 * 
 * Scrapes and returns the latest updated anime episodes from AniWatchTV.
 * Supports pagination the `page` query parameter.
 */

export const getLatestEpisodes: RequestHandler = async (req, res) => {
  try {
    // Extract page number from query parameter, default to 1 if not provided
    // Decode URI to handle any special characters in the page number
    const page = Number(req.query.page) || 1;

    const { episodes, totalPages } = await scrapeLatestUpdated(page);

    console.log(`Hit /aniwatchtv/latest?page=${page}, scraped ${episodes.length} episodes`);

    
    res.status(200).json({
      latestEpisodes: episodes,
      totalPages,
    });
  } catch (err) {
    console.error("getLatestEpisodes failed:", err);
    res.status(500).json({ error: "Failed to fetch latest episodes" });
  }
};
