// Interfaces for different data types
import type { ScrapedHomePage } from "./home";
import type { ScrapedAboutPage } from "./about";
import type { ScrapedSearchPage } from "./search";
import type { ScrapedCategoryPage } from "./category";
import type { ScrapedEpisodesPage } from "./episodes";
import type { ScrapedEpisodeServer } from "./episodeServers";
import type { ScrapedAnimeEpisodesSources } from "./episodeStreamingSources";
import type { GetRoot } from "./root";

// Core anime models
interface MinimalAnime {
  id: string | null;
  name: string | null;
  img: string | null;
}

interface Anime extends MinimalAnime {
  episodes: {
    eps: number | null;
    sub: number | null;
    dub: number | null;
  };
}

interface Top10Anime extends Anime {
  rank: number | null;
}
type Top10AnimeTimePeriod = "day" | "week" | "month";

interface SpotLightAnime extends Anime {
  rank: number | null;
  duration: string | null;
  category: string | null;
  releasedDay: string | null;
  quality: string | null;
  description: string | null;
}

interface TopUpcomingAnime extends Anime {
  duration: string | null;
  rated: boolean | false;
}
type LatestAnimeEpisode = TopUpcomingAnime;

interface AboutAnimeInfo extends Anime {
  anime_id: number | null;
  mal_id: number | null;
  al_id: number | null;
  rating: string | null;
  category: string | null;
  duration: string | null;
  quality: string | null;
  description: string | null;
}
type ExtraAboutAnimeInfo = Record<string, string | string[]>;

interface AnimeSeasonsInfo extends MinimalAnime {
  seasonTitle: string | null;
  isCurrent: boolean | false;
}

interface RelatedAnime extends Anime {
  category: string | null;
}

type RecommendedAnime = TopUpcomingAnime;
type MostPopularAnime = RelatedAnime;
type SearchedAnime = TopUpcomingAnime;
type CategoryAnime = TopUpcomingAnime;

interface Episode {
  name: string | null;
  episodeNo: number | null;
  episodeId: string | null;
  filler: boolean | false;
}

interface SubEpisode {
  serverName: string;
  serverId: number | null;
}
type DubEpisode = SubEpisode;
type RawEpisode = SubEpisode;

// Streaming data
interface Video {
  url: string;
  quality?: string;
  isM3U8?: boolean;
  size?: number;
  [x: string]: unknown;
}

interface Subtitle {
  id?: string;
  url: string;
  lang: string;
}

interface Intro {
  start: number;
  end: number;
}

interface IVideo {
  url: string;
  quality?: string;
  isM3U8?: boolean;
  isDASH?: boolean;
  size?: number;
  [x: string]: unknown;
}

interface ISubtitle {
  id?: string;
  url: string;
  lang: string;
}

interface ISource {
  headers?: { [k: string]: string };
  intro?: Intro;
  outro?: Intro;
  subtitles?: ISubtitle[];
  sources: IVideo[];
  download?: string;
  embedURL?: string;
}

interface ProxyConfig {
  url: string | string[];
  key?: string;
  rotateInterval?: number;
}

// Server definitions (Only MegaCloud supported)
type AnimeServers = "megacloud";

enum Servers {
  MegaCloud = "megacloud",
}

// Category/Genre types
type Category =
  | "subbed-anime"
  | "dubbed-anime"
  | "tv"
  | "movie"
  | "most-popular"
  | "top-airing"
  | "ova"
  | "ona"
  | "special"
  | "events";

type Genre =
  | "Action" | "Adventure" | "Cars" | "Comedy" | "Dementia" | "Demons"
  | "Drama" | "Ecchi" | "Fantasy" | "Game" | "Harem" | "Historical"
  | "Horror" | "Isekai" | "Josei" | "Kids" | "Magic" | "Martial Arts"
  | "Mecha" | "Military" | "Music" | "Mystery" | "Parody" | "Police"
  | "Psychological" | "Romance" | "Samurai" | "School" | "Sci-Fi"
  | "Seinen" | "Shoujo" | "Shoujo Ai" | "Shounen" | "Shounen Ai"
  | "Slice of Life" | "Space" | "Sports" | "Super Power"
  | "Supernatural" | "Thriller" | "Vampire";

// Exports
export {
  GetRoot,
  ScrapedHomePage,
  ScrapedAboutPage,
  ScrapedSearchPage,
  ScrapedCategoryPage,
  ScrapedEpisodesPage,
  ScrapedEpisodeServer,
  ScrapedAnimeEpisodesSources,
  MinimalAnime,
  Anime,
  Top10Anime,
  Top10AnimeTimePeriod,
  SpotLightAnime,
  TopUpcomingAnime,
  LatestAnimeEpisode,
  AboutAnimeInfo,
  ExtraAboutAnimeInfo,
  AnimeSeasonsInfo,
  RelatedAnime,
  RecommendedAnime,
  MostPopularAnime,
  SearchedAnime,
  CategoryAnime,
  Genre,
  Category,
  Episode,
  SubEpisode,
  DubEpisode,
  RawEpisode,
  AnimeServers,
  Servers,
  Video,
  Subtitle,
  Intro,
  ProxyConfig,
  IVideo,
  ISource,
  ISubtitle,
};