"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.scrapeEpisodeServerList = void 0;
const aniwatchtvRoutes_1 = require("../utils/aniwatchtvRoutes");
const headers_1 = require("../config/headers");
const axios_1 = __importStar(require("axios"));
const http_errors_1 = __importDefault(require("http-errors"));
const cheerio_1 = require("cheerio");
const scrapeEpisodeServerList = (episodeUrl) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = {
        episodeId: episodeUrl,
        episodeNo: 0,
        sub: [],
        dub: [],
        raw: [],
    };
    try {
        const episodeId = episodeUrl.split("?ep=")[1];
        const aniwatchUrls = yield (0, aniwatchtvRoutes_1.getAniWatchTVUrls)();
        const { data } = yield axios_1.default.get(`${aniwatchUrls.AJAX}/v2/episode/servers?episodeId=${episodeId}`, {
            headers: {
                "User-Agent": headers_1.headers.USER_AGENT_HEADER,
                "X-Requested-With": "XMLHttpRequest",
                "Accept-Encoding": headers_1.headers.ACCEPT_ENCODING_HEADER,
                Accept: headers_1.headers.ACCEPT_HEADER,
                Referer: new URL(`/watch/${episodeUrl}`, aniwatchUrls.BASE).href,
            },
        });
        const $ = (0, cheerio_1.load)(data.html);
        // Extract episode number
        const episodeNumberSelector = ".server-notice strong";
        result.episodeNo = Number($(episodeNumberSelector).text().split(" ").pop()) || 0;
        // Extract server lists
        const extractServers = (selector) => $(selector).map((_, el) => {
            var _a;
            return ({
                serverName: $(el).find("a").text().toLowerCase().trim(),
                serverId: Number((_a = $(el).attr("data-server-id")) === null || _a === void 0 ? void 0 : _a.trim()) || null,
            });
        }).get();
        result.sub = extractServers(".servers-sub .ps__-list .server-item");
        result.dub = extractServers(".servers-dub .ps__-list .server-item");
        result.raw = extractServers(".servers-raw .ps__-list .server-item");
        return result;
    }
    catch (err) {
        console.error("Error in scrapeEpisodeServerList:", err);
        if (err instanceof axios_1.AxiosError) {
            throw (0, http_errors_1.default)(((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) || 500, ((_b = err.response) === null || _b === void 0 ? void 0 : _b.statusText) || "Something went wrong");
        }
        throw http_errors_1.default.InternalServerError("Internal server error");
    }
});
exports.scrapeEpisodeServerList = scrapeEpisodeServerList;
