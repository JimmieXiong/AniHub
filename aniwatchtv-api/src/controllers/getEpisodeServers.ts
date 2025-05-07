import { type RequestHandler } from "express";
import createHttpError from "http-errors";

import { scrapeEpisodeServerList } from "../scrapers"; // Import from index.ts

/**
 * GET /aniwatchtv/episode/servers
 * Retrieves available streaming servers for a specific episode
 */

const getEpisodeServersInfo: RequestHandler = async (req, res) => {
  try {
    // Get the episode ID from query parameters, decode if URL-encoded
    const episodeId = req.query.id
      ? decodeURIComponent(req.query.id as string)
      : null;

    if (!episodeId) {
      throw createHttpError.BadRequest("Episode ID is required"); // 404 if no episode provided
    }

    // Call scraper to fetch all available server options for the episode but only scrape megacloud servers as I removed the other sources
    const serverData = await scrapeEpisodeServerList(episodeId);
    res.status(200).json(serverData);
  } catch (err) {
    console.error("Error in getEpisodeServersInfo:", err);
    res.status(500).json({ error: "Failed to fetch episode server data" });
  }
};

export { getEpisodeServersInfo };
