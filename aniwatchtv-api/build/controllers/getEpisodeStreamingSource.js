"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEpisodeStreamingSourceInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const http_errors_1 = __importDefault(require("http-errors"));
const scrapeStreamingSourceFromMegaCloud_1 = require("../scrapers/scrapeStreamingSourceFromMegaCloud");
const aniwatchtvRoutes_1 = require("../utils/aniwatchtvRoutes");
const headers_1 = require("../config/headers");
/**
 * GET /aniwatchtv/episode/source?id=...&category=sub
 * Fetches video stream sources + AniList/MAL ID metadata.
 */
const getEpisodeStreamingSourceInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const episodeId = req.query.id
            ? decodeURIComponent(req.query.id)
            : null;
        const category = (req.query.category
            ? decodeURIComponent(req.query.category)
            : "sub");
        if (!episodeId) {
            throw http_errors_1.default.BadRequest("Episode ID is required");
        }
        const aniwatchUrls = yield (0, aniwatchtvRoutes_1.getAniWatchTVUrls)();
        // 🎥 Get stream info
        const streamingData = yield (0, scrapeStreamingSourceFromMegaCloud_1.scrapeStreamingSourceFromMegaCloud)(episodeId, category);
        // 🧠 Extract AniList & MAL IDs
        const animePageUrl = new URL(episodeId.split("?ep=")[0], aniwatchUrls.BASE).href;
        const animePage = yield axios_1.default.get(animePageUrl, {
            headers: {
                Referer: aniwatchUrls.BASE,
                "User-Agent": headers_1.headers.USER_AGENT_HEADER,
                "X-Requested-With": "XMLHttpRequest",
            },
        });
        const $ = (0, cheerio_1.load)(animePage.data);
        const syncDataText = $("#syncData").text();
        let malID = null;
        let anilistID = null;
        try {
            const syncData = JSON.parse(syncDataText);
            malID = Number(syncData === null || syncData === void 0 ? void 0 : syncData.mal_id) || null;
            anilistID = Number(syncData === null || syncData === void 0 ? void 0 : syncData.anilist_id) || null;
        }
        catch (_a) {
            // fallback to null
        }
        res.status(200).json(Object.assign(Object.assign({}, streamingData), { anilistID,
            malID }));
    }
    catch (err) {
        console.error("❌ Error in getEpisodeStreamingSourceInfo:", err);
        res.status(500).json({ error: "Failed to fetch episode source data" });
    }
});
exports.getEpisodeStreamingSourceInfo = getEpisodeStreamingSourceInfo;
