"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Import route handlers (controllers)
const controllers_1 = require("../../controllers");
const aniwatchRouter = (0, express_1.Router)();
/**
 * Base path: /aniwatchtv
 * These routes are mounted under /aniwatchtv in the main router
 */
// Homepage
aniwatchRouter.get("/", controllers_1.getHomePageInfo);
// A-Z Anime List
aniwatchRouter.get("/az-list", controllers_1.getAtoZAnimeList);
// Search
aniwatchRouter.get("/search", controllers_1.getSearchPageInfo);
// Anime Details
aniwatchRouter.get("/anime/:id", controllers_1.getAnimeDetails);
// Episodes List
aniwatchRouter.get("/episodes/:id", controllers_1.getEpisodesInfo);
// Server List for Episode
aniwatchRouter.get("/servers", controllers_1.getEpisodeServersInfo);
// Streaming Source (Video URL)
aniwatchRouter.get("/episode-srcs", controllers_1.getEpisodeStreamingSourceInfo);
// Browse by Category (e.g., /aniwatchtv/action?page=2)
aniwatchRouter.get("/:category", controllers_1.getCategoryPageInfo);
exports.default = aniwatchRouter;
