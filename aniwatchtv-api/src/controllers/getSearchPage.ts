import { scrapeAnimeSearchResults } from "../scrapers"; 
import createHttpError from "http-errors";
import type { RequestHandler } from "express";


/**
 * GET /aniwatchtv/search?keyword=naruto&page=1
 * 
 * Scrapes and returns anime search results from AniWatchTV.
 * Accepts:
 * - `keyword`: the search term (required)
 * - `page`: optional, defaults to 1
 */

const getSearchPageInfo: RequestHandler = async (req, res) => {
  try {
    // Extract search keyword and page number from query parameters
    // Decode URI to handle any special characters in the keyword and page number
    const page = req.query.page
      ? Number(decodeURIComponent(req.query.page as string))
      : 1;

    // Decode the keyword from the query parameter
    // If the keyword is not provided, throw a BadRequest error
    const keyword = req.query.keyword
      ? decodeURIComponent(req.query.keyword as string)
      : null;

    if (!keyword) {
      throw createHttpError.BadRequest("Search keyword required");
    }

    // Call the scraper to fetch search results based on the keyword and page number
    // The scraper function should handle the logic of scraping the search results
    const data = await scrapeAnimeSearchResults(keyword, page);

    // debugging log to see the structure of the data returned
 // log how many results were scraped
  if ("results" in data && Array.isArray(data.results)) {
    if (data.results.length === 0) {
      console.log(`No anime found for "${keyword}"`);
    } else {
      console.log(`Found ${data.results.length} results for "${keyword}"`);
    }
  } 
  
  res.status(200).json(data);
  } catch (err) {
    console.error("Error in getSearchPageInfo:", err); 
    res.status(500).json({ error: "Failed to fetch search results" });
  }
};

export { getSearchPageInfo };
