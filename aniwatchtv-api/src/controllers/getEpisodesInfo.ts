import { type RequestHandler } from "express";
import createHttpError from "http-errors";
import { scrapeEpisodeServerList } from "../scrapers"; // Assumes you have index.ts

/**
 * GET /aniwatchtv/episodes/:id
 * Retrieves all episodes for the given anime ID
 */
const getEpisodesInfo: RequestHandler = async (req, res) => {
  try {
    const animeId = req.params.id ? decodeURIComponent(req.params.id) : null;

    if (!animeId) {
      throw createHttpError.BadRequest("Anime ID is required");
    }

    const episodesData = await scrapeEpisodeServerList(animeId);
    res.status(200).json(episodesData);
  } catch (err) {
    console.error("❌ Error in getEpisodesInfo:", err);
    res.status(500).json({ error: "Failed to fetch episodes for the anime" });
  }
};

export { getEpisodesInfo };
