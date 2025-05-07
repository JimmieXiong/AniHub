import type { RequestHandler } from "express";
import axios from "axios";
import { scrapeHomePage } from "../scrapers";

/**
 * GET /aniwatchtv/homepage
 * 
 * Scrapes and returns homepage content from AniWatchTV.
 * Sections include:
 * - Spotlight / Featured anime
 * - Latest updates
 * - Popular or trending anime
 */

export const getHomePageInfo: RequestHandler = async (_req, res) => {
  try {
    const data = await scrapeHomePage();

    if (!data || Object.keys(data).length === 0) {
      try {
        await axios.get("https://aniwatchtv.to/");
        res.status(404).json({
          error: "AniWatchTV is online, but no homepage data was found.",
        });
        return; // explicitly stop execution
      } catch (pingError) {
        res.status(503).json({
          error: "AniWatchTV offline or unreachable.",
        });
        return;
      }
    }

    console.log("Homepage data:", data);

    res.status(200).json(data); 
  } catch (error) {
    console.error("Error in getHomePageInfo:", error);  }
};
