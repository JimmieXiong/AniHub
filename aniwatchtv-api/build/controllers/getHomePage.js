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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHomePageInfo = void 0;
const scrapers_1 = require("../scrapers");
const getHomePageInfo = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, scrapers_1.scrapeHomePage)();
        res.status(200).json(data);
    }
    catch (error) {
        console.error("❌ Error in getHomePageInfo:", error);
        res.status(500).json({ error: "Failed to load homepage content" });
    }
});
exports.getHomePageInfo = getHomePageInfo;
