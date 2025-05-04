/**
 * 🔁 backgroundScraper.ts
 * This script scrapes all anime data from AniWatch's A-Z pages,
 * fetches detailed info (like description, rating, origin),
 * and writes a JSON file to disk.
 */

import fs from "fs/promises";
import path from "path";

import { scrapeAtoZAnimeList } from "./scrapeAtoZAnimeList";
import { scrapeAnimeDetails } from "./scrapeAnimeDetails";
import { detectCountry } from "../utils/detectCountry";

interface ScrapedAnime {
  id: string;
  name: string;
  origin: "Japan" | "China" | "Unknown";
  description?: string;
  img?: string;
  rating?: string;
  category?: string;
  eps?: number | null;
  sub?: number | null;
  dub?: number | null;
  
}

const runBackgroundScraper = async () => {
  const maxPages = 100;
  const allAnimes: ScrapedAnime[] = [];

  for (let page = 1; page <= maxPages; page++) {
    console.log(`📄 Fetching A-Z page ${page}...`);
    const animes = await scrapeAtoZAnimeList(page);

    if (!Array.isArray(animes) || animes.length === 0) {
      console.log("✅ No more animes found. Stopping.");
      break;
    }

    for (const anime of animes) {
      if (!anime.id) {
        console.warn("⚠️ Skipping anime with null ID.");
        continue;
      }
    
      try {
        const about = await scrapeAnimeDetails(anime.id);
    
        if ("info" in about) {
          const studiosRaw = about.moreInfo["Studios:"];
          const studios = typeof studiosRaw === "string"
            ? studiosRaw.split(",").map((s) => s.trim())
            : [];
    
          const origin = detectCountry(studios);
    
          allAnimes.push({
            id: anime.id,
            name: about.info.name ?? "Unknown Anime",
            img: about.info.img ?? anime.img ?? undefined,
            description: about.info.description ?? undefined,
            rating: about.info.rating ?? undefined,
            category: about.info.category ?? undefined,
            eps: about.info.episodes?.eps ?? null,
            sub: about.info.episodes?.sub ?? null,
            dub: about.info.episodes?.dub ?? null,
            origin,
          });
    
          console.log(`✅ Scraped: ${about.info.name ?? anime.id} (${origin})`);
        }
      } catch (err) {
        console.error(`❌ Failed scraping ${anime.name || anime.id}:`, err);
      }
    }
  }    
  const outputPath = path.join(__dirname, "anime-origin-data.json");
  await fs.writeFile(outputPath, JSON.stringify(allAnimes, null, 2), "utf-8");
  console.log(`🎉 Done! Saved ${allAnimes.length} anime entries to ${outputPath}`);
};

runBackgroundScraper();
