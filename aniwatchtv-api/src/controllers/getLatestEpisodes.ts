import { scrapeLatestUpdated } from "../scrapers/scrapeLatestUpdated";
import type { RequestHandler } from "express";

export const getLatestEpisodes: RequestHandler = async (req, res) => {
  try {
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
