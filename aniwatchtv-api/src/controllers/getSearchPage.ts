import { scrapeAnimeSearchResults } from "../scrapers"; 
import createHttpError from "http-errors";
import type { RequestHandler } from "express";

const getSearchPageInfo: RequestHandler = async (req, res) => {
  try {
    const page = req.query.page
      ? Number(decodeURIComponent(req.query.page as string))
      : 1;

    const keyword = req.query.keyword
      ? decodeURIComponent(req.query.keyword as string)
      : null;

    if (!keyword) {
      throw createHttpError.BadRequest("Search keyword required");
    }

    const data = await scrapeAnimeSearchResults(keyword, page);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in getSearchPageInfo:", err); 
    res.status(500).json({ error: "Failed to fetch search results" });
  }
};

export { getSearchPageInfo };
