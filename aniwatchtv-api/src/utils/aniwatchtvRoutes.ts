import { isSiteReachable } from "./isSiteReachable";

export type AniWatchUrls = {
  BASE: string;
  HOME: string;
  SEARCH: string;
  GENRE: string;
  AJAX: string;
};

// Hardcoded base URL (you can adjust if needed)
const BASE_URL = "https://aniwatchtv.to";

// Constructs full AniWatch route paths
const buildAniWatchTVUrls = (baseUrl: string): AniWatchUrls => ({
  BASE: baseUrl,
  HOME: baseUrl, // 👈 FIX: no `/home`
  SEARCH: `${baseUrl}/search`,
  GENRE: `${baseUrl}/genre`,
  AJAX: `${baseUrl}/ajax`,
});


// Validates base URL reachability and returns full route set
const getAniWatchTVUrls = async (): Promise<AniWatchUrls> => {
  try {
    const reachable = await isSiteReachable(BASE_URL);
    if (!reachable) throw new Error("AniWatch base URL is not reachable");

    return buildAniWatchTVUrls(BASE_URL);
  } catch (error) {
    console.error("Error reaching AniWatch site:", error);
    throw error;
  }
};
export { BASE_URL };
export { getAniWatchTVUrls };
