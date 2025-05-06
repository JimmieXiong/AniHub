import type { CheerioAPI, SelectorType } from "cheerio";
import { Anime } from "../types/animeTypes";

export const extractAtoZAnimes = ($: CheerioAPI, selector: SelectorType): Anime[] => {
  const animes: Anime[] = [];

  $(selector).each((_index, element) => {
    const href = $(element).find(".film-poster > a").attr("href");
    const id = href?.split("/").pop() ?? null;

    const name = $(element).find(".dynamic-name").text().trim() ?? null;
    const img = $(element).find(".film-poster img").attr("data-src") ?? null;

    const eps = parseInt($(element).find(".tick-eps").text().trim()) || null;
    const sub = parseInt($(element).find(".tick-sub").text().trim()) || null;
    const dub = parseInt($(element).find(".tick-dub").text().trim()) || null;

    if (id && name && img) {
      animes.push({
        id,
        name,
        img,
        episodes: {
          eps,
          sub,
          dub,
        },
      });
    } else {
      console.log("Missing data for one item:", { id, name, img });
    }
  });

  console.log("Extracted A-Z animes:", animes.length);
  return animes;
};
