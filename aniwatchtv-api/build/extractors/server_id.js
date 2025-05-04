"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractServerId = void 0;
const extractServerId = ($, index, category) => {
    var _a, _b, _c;
    console.warn("DEBUGPRINT[2]: server_id.ts:5: index=", index);
    console.warn("DEBUGPRINT[3]: server_id.ts:6: category=", category);
    return (((_c = (_b = (_a = $(`.ps_-block.ps_-block-sub.servers-${category} > .ps__-list .server-item`)) === null || _a === void 0 ? void 0 : _a.map((_, el) => $(el).attr("data-server-id") == `${index}` ? $(el) : null)) === null || _b === void 0 ? void 0 : _b.get()[0]) === null || _c === void 0 ? void 0 : _c.attr("data-id")) || null);
};
exports.extractServerId = extractServerId;
