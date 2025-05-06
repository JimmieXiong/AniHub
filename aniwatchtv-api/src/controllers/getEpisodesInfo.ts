import createHttpError from "http-errors";
import type { RequestHandler } from "express";
import { scrapeAnimeEpisodes } from "../scrapers"; 

const getEpisodesInfo: RequestHandler = async (req, res) => {
  try {
    const anime_id = req.params.id ? decodeURIComponent(req.params.id) : null;

    if (!anime_id) {
      throw createHttpError.BadRequest("Anime Id Required");
    }

    const data = await scrapeAnimeEpisodes(anime_id);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in getEpisodesInfo:", err);
    res.status(500).json({ error: "Failed to fetch episode info" });
  }
};

export { getEpisodesInfo };
