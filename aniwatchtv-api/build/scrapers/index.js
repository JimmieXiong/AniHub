"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeAtoZAnimeList = exports.scrapeStreamingSourceFromMegaCloud = exports.scrapeEpisodeServerList = exports.scrapeAnimeEpisodes = exports.scrapeAnimeCategories = exports.scrapeAnimeSearchResults = exports.scrapeAnimeDetails = exports.scrapeHomePage = void 0;
const scrapeHomePage_1 = require("./scrapeHomePage"); // good
Object.defineProperty(exports, "scrapeHomePage", { enumerable: true, get: function () { return scrapeHomePage_1.scrapeHomePage; } });
const scrapeAnimeDetails_1 = require("./scrapeAnimeDetails"); // good 
Object.defineProperty(exports, "scrapeAnimeDetails", { enumerable: true, get: function () { return scrapeAnimeDetails_1.scrapeAnimeDetails; } });
const scrapeAnimeSearchResults_1 = require("./scrapeAnimeSearchResults"); // good 
Object.defineProperty(exports, "scrapeAnimeSearchResults", { enumerable: true, get: function () { return scrapeAnimeSearchResults_1.scrapeAnimeSearchResults; } });
const scrapeAnimeCategories_1 = require("./scrapeAnimeCategories"); // good
Object.defineProperty(exports, "scrapeAnimeCategories", { enumerable: true, get: function () { return scrapeAnimeCategories_1.scrapeAnimeCategories; } });
const scrapeAnimeEpisodes_1 = require("./scrapeAnimeEpisodes"); // good scrapes all anime Episodes
Object.defineProperty(exports, "scrapeAnimeEpisodes", { enumerable: true, get: function () { return scrapeAnimeEpisodes_1.scrapeAnimeEpisodes; } });
const scrapeEpisodeServerList_1 = require("./scrapeEpisodeServerList");
Object.defineProperty(exports, "scrapeEpisodeServerList", { enumerable: true, get: function () { return scrapeEpisodeServerList_1.scrapeEpisodeServerList; } });
const scrapeStreamingSourceFromMegaCloud_1 = require("./scrapeStreamingSourceFromMegaCloud");
Object.defineProperty(exports, "scrapeStreamingSourceFromMegaCloud", { enumerable: true, get: function () { return scrapeStreamingSourceFromMegaCloud_1.scrapeStreamingSourceFromMegaCloud; } });
const scrapeAtoZAnimeList_1 = require("./scrapeAtoZAnimeList"); // good
Object.defineProperty(exports, "scrapeAtoZAnimeList", { enumerable: true, get: function () { return scrapeAtoZAnimeList_1.scrapeAtoZAnimeList; } });
