"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const routes_1 = __importDefault(require("./routes"));
// This reads “.env” and merges its contents into process.env
(0, dotenv_1.config)();
// Create an instance of express
const app = (0, express_1.default)();
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3001;
// adds cors middleware to the app, allowing cross-origin requests
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // ← allows req.body to work
// router
app.use("/", routes_1.default);
app.listen(PORT, () => {
    console.log(`API is running on http://localhost:${PORT}`);
});
exports.default = app;
