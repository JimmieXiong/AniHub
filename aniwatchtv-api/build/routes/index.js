"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Import the sub-router that handles all /aniwatchtv routes
const aniwatchtv_1 = __importDefault(require("./aniwatchtv"));
// Import the root handler that checks if aniwatchtv.to is reachable
const aniwatchStatusHandler_1 = __importDefault(require("../utils/aniwatchStatusHandler"));
// Create a new Express router instance
const router = (0, express_1.Router)();
/**
 * When sending a GET request to the root route http://locahost:3000, it will run the
 * rootHandler function to check if aniwatchtv.to is online
 * Returns: { aniwatch: true | false }
 */
router.get("/", aniwatchStatusHandler_1.default);
/**
 * Simple health check route to confirm server if is alive
 * When sending a GET request to the route /health, it will returns a basic JSON message with timestamp
 * _req: does not need to be used, so it is set to underscore
 * Returns: { status: "healthy", timestamp: "2023-10-01T12:00:00Z", message: "AniwatchTV API is running" }
 */
router.get("/health", (_req, res) => {
    res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        message: "AniwatchTV API is running",
    });
});
/**
 * Connects the aRouter to the main router
 * Mount sub-routes under /aniwatchtv
 * Example: /aniwatchtv/search, /aniwatchtv/anime/:id, etc.
 */
router.use("/aniwatchtv", aniwatchtv_1.default);
// Export the router for use in the main app
exports.default = router;
