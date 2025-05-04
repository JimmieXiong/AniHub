import { SubEpisode, DubEpisode, RawEpisode } from "./animeTypes";

export interface ScrapedEpisodeServer {
  episodeId: string;
  episodeNo: number;
  sub: SubEpisode[];
  dub: DubEpisode[];
  raw: RawEpisode[];
}
