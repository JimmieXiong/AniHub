"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTrendingAnimes = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const axios_1 = require("axios");
const extractTrendingAnimes = ($, selectors) => {
    var _a, _b;
    try {
        const animes = [];
        $(selectors).each((_index, element) => {
            var _a, _b, _c, _d, _e, _f, _g;
            const animeID = ((_b = (_a = $(element).find(".item .film-poster")) === null || _a === void 0 ? void 0 : _a.attr("href")) === null || _b === void 0 ? void 0 : _b.slice(1)) || null;
            const animeNAME = (_e = (_d = (_c = $(element)
                .find(".item .number .film-title.dynamic-name")) === null || _c === void 0 ? void 0 : _c.text()) === null || _d === void 0 ? void 0 : _d.trim()) !== null && _e !== void 0 ? _e : "UNKNOWN ANIME";
            const animeIMG = ((_g = (_f = $(element)
                .find(".item .film-poster .film-poster-img")) === null || _f === void 0 ? void 0 : _f.attr("data-src")) === null || _g === void 0 ? void 0 : _g.trim()) || null;
            animes.push({
                id: animeID,
                name: animeNAME,
                img: animeIMG,
            });
        });
        return animes;
    }
    catch (err) {
        ///////////////////////////////////////////////////////////////////////
        console.error("Error in extract_trending_animes :", err); // for TESTING//
        ///////////////////////////////////////////////////////////////////////
        if (err instanceof axios_1.AxiosError) {
            throw (0, http_errors_1.default)(((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status) || 500, ((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.statusText) || "Something went wrong");
        }
        else {
            throw http_errors_1.default.InternalServerError("Internal server error");
        }
    }
};
exports.extractTrendingAnimes = extractTrendingAnimes;
