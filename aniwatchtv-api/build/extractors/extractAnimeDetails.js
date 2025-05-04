"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAnimeDetails = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const axios_1 = require("axios");
const extractAnimeDetails = ($, selector) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        const syncData = JSON.parse($("#syncData").text() || "{}");
        const anime_id = parseIntSafe(syncData.anime_id);
        const mal_id = parseIntSafe(syncData.mal_id);
        const al_id = parseIntSafe(syncData.anilist_id);
        const animeElement = $(selector);
        const id = (_c = (_b = (_a = animeElement.find(".anisc-detail .film-buttons a.btn-play").attr("href")) === null || _a === void 0 ? void 0 : _a.split("/")) === null || _b === void 0 ? void 0 : _b.pop()) !== null && _c !== void 0 ? _c : null;
        const name = animeElement.find(".anisc-detail .film-name.dynamic-name").text().trim() ||
            "UNKNOWN ANIME";
        const img = (_e = (_d = animeElement.find(".film-poster .film-poster-img").attr("src")) === null || _d === void 0 ? void 0 : _d.trim()) !== null && _e !== void 0 ? _e : null;
        const rating = animeElement.find(".film-stats .tick .tick-pg").text().trim() || null;
        const quality = animeElement.find(".film-stats .tick .tick-quality").text().trim() || null;
        const sub = Number(animeElement.find(".film-stats .tick .tick-sub").text().trim()) ||
            null;
        const dub = Number(animeElement.find(".film-stats .tick .tick-dub").text().trim()) ||
            null;
        const eps = Number(animeElement.find(".film-stats .tick .tick-eps").text().trim()) ||
            null;
        const category = animeElement
            .find(".film-stats .tick")
            .text()
            .trim()
            .replace(/[\s\n]+/g, " ")
            .split(" ")
            .at(-2) || null;
        const duration = animeElement
            .find(".film-stats .tick")
            .text()
            .trim()
            .replace(/[\s\n]+/g, " ")
            .split(" ")
            .pop() || null;
        const description = ((_g = (_f = animeElement
            .find(".anisc-detail .film-description .text")
            .text()) === null || _f === void 0 ? void 0 : _f.split("[")[0]) === null || _g === void 0 ? void 0 : _g.trim()) || "UNKNOWN ANIME DESCRIPTION";
        const info = {
            id,
            mal_id,
            anime_id,
            al_id,
            name,
            img,
            rating,
            episodes: {
                eps,
                sub,
                dub,
            },
            category,
            quality,
            duration,
            description,
        };
        return info;
    }
    catch (err) {
        console.error("Error in extractAnimeDetails:", err);
        if (err instanceof axios_1.AxiosError) {
            throw (0, http_errors_1.default)(((_h = err === null || err === void 0 ? void 0 : err.response) === null || _h === void 0 ? void 0 : _h.status) || 500, ((_j = err === null || err === void 0 ? void 0 : err.response) === null || _j === void 0 ? void 0 : _j.statusText) || "Something went wrong");
        }
        else {
            throw http_errors_1.default.InternalServerError("Internal server error");
        }
    }
};
exports.extractAnimeDetails = extractAnimeDetails;
function parseIntSafe(str) {
    const parsed = parseInt(str, 10);
    return isNaN(parsed) ? null : parsed;
}
