import type { RequestHandler } from "express";
import createHttpError from "http-errors";
import { scrapeAnimeCategories } from "../scrapers/scrapeAnimeCategories";

/**
 * GET /aniwatchtv/category/:category?page=1
 * Scrapes and returns anime category page results.
 */
const getCategoryPageInfo: RequestHandler = async (req, res) => {
  try {
    const category = req.params.category;
    const page = req.query.page
      ? Number(decodeURIComponent(req.query.page as string))
      : 1;

    if (!category) {
      throw createHttpError.BadRequest("Category parameter is required.");
    }

    const data = await scrapeAnimeCategories(category, page);
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error in getCategoryPageInfo:", error);
    res.status(500).json({ error: "Failed to fetch category page" });
  }
};

export { getCategoryPageInfo };
