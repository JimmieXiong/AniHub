import type { RequestHandler } from "express";
import { scrapeAtoZAnimeList } from "../scrapers/scrapeAtoZAnimeList"; 

/**
 * GET /aniwatchtv/atoz?page=1
 * Returns paginated list of anime (A-Z).
 */
const getAtoZAnimeList: RequestHandler = async (req, res) => {
  try {
    const page = req.query.page
      ? Number(decodeURIComponent(req.query.page as string))
      : 1;

    const data = await scrapeAtoZAnimeList(page);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in getAtoZAnimeList:", error);
    res.status(500).json({ error: "Failed to load A-Z anime list" });
  }
};

export { getAtoZAnimeList };
