import { RequestHandler } from "express";
import extractLatestUpdated from "../extractors/extractLatestUpdated";

export const getLatestEpisodes: RequestHandler = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const episodes = await extractLatestUpdated(page);

    // If the result is unexpectedly empty, log a warning
    if (!episodes.length) {
      console.warn(`⚠️ No latest episodes found for page ${page}`);
    }

    res.status(200).json({ latestEpisodes: episodes });
  } catch (error: any) {
    console.error("❌ getLatestEpisodes failed:", error.message || error);

    // Provide more detailed error response for debugging
    res.status(500).json({
      error: "Failed to fetch latest episodes",
      message: error?.message || "Internal Server Error",
    });
  }
};
