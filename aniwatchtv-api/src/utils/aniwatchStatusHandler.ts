import type { RequestHandler } from "express";
import { isSiteReachable } from "./isSiteReachable";

/**
 * GET /
 * Checks if https://aniwatchtv.to is reachable and returns its status.
 */
const aniwatchStatusHandler: RequestHandler = async (_req, res) => {
  try {
    const isReachable = await isSiteReachable("https://aniwatchtv.to");

    console.log("Is aniwatchtv.to reachable?", isReachable);

    res.status(200).json({ aniwatch: isReachable });
  } catch (error) {
    console.error("Error checking AniwatchTV status:", error);
    res.status(500).json({ error: "Failed to check site status" });
  }
};

export default aniwatchStatusHandler;
