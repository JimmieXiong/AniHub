import type { RequestHandler } from "express";
import createHttpError from "http-errors"; 
import { scrapeAnimeDetails } from "../scrapers/scrapeAnimeDetails";

/**
 * Handles GET /aniwatchtv/anime/:id
 * Ex: This controller runs when someone visits /aniwatch/anime/jujutsu-kaisen-2nd-season-18413
 * It fetches detailed anime info using the ID from the URL.
 */

const getAnimeDetails: RequestHandler = async (req, res) => {
  try {
    const animeId = req.params.id?.trim(); // Remove leading/trailing spaces

    // Check Missing or empty
    if (!animeId) {
      throw createHttpError.BadRequest("Anime ID is required.");
    }

    // Check Must match full valid format — lowercase, dashes, ends in number
    if (!/^[a-z0-9]+(-[a-z0-9]+)*-\d+$/.test(animeId)) {
      throw createHttpError.BadRequest(
        "Invalid Anime ID format. Must be lowercase, use dashes, and end with a numeric ID."
      );
    }
 
    // scrapeAnimeDetails("jujutsu-kaisen-2nd-season-18413");
    const data = await scrapeAnimeDetails(animeId);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in getAnimeDetails:", err);

    if (createHttpError.isHttpError(err)) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Failed to fetch anime details." });
    }
  }
};

export { getAnimeDetails };