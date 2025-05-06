// getHomePage.ts
import type { RequestHandler } from "express";
import { scrapeHomePage } from "../scrapers";

export const getHomePageInfo: RequestHandler = async (_req, res) => {
  try {
    const data = await scrapeHomePage();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in getHomePageInfo:", error);
    res.status(500).json({ error: "Failed to load homepage content" });
  }
};
