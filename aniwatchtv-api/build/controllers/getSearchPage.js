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
exports.getSearchPageInfo = void 0;
const scrapers_1 = require("../scrapers"); // ✅ Correct relative path
const http_errors_1 = __importDefault(require("http-errors"));
const getSearchPageInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = req.query.page
            ? Number(decodeURIComponent(req.query.page))
            : 1;
        const keyword = req.query.keyword
            ? decodeURIComponent(req.query.keyword)
            : null;
        if (!keyword) {
            throw http_errors_1.default.BadRequest("Search keyword required");
        }
        const data = yield (0, scrapers_1.scrapeAnimeSearchResults)(keyword, page);
        res.status(200).json(data);
    }
    catch (err) {
        console.error("❌ Error in getSearchPageInfo:", err); // more descriptive
        res.status(500).json({ error: "Failed to fetch search results" }); // ✅ return a response
    }
});
exports.getSearchPageInfo = getSearchPageInfo;
