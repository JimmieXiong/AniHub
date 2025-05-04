"use strict";
// src/utils/aniwatch/detectCountry.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectCountry = detectCountry;
function detectCountry(studios) {
    const studioNames = studios.map(s => s.toLowerCase());
    const japaneseStudios = [
        "a-1 pictures",
        "toei",
        "mappa",
        "ufotable",
        "kyoto animation",
        "bones",
        "wit studio",
        "cloverworks",
        "studio deen",
        "production i.g"
    ];
    const chineseStudios = [
        "tencent",
        "tencent penguin",
        "bilibili",
        "iqiyi",
        "youku",
        "haoliners",
        "xing yi kai chen",
        "build dream",
        "shanghai motion magic",
        "bigfirebird",
        "colored pencil",
        "studio lan",
        "soyep",
        "cg year",
        "bedream",
        "kjj animation",
        "foch film"
    ];
    if (studioNames.some(s => japaneseStudios.some(j => s.includes(j))))
        return "Japan";
    if (studioNames.some(s => chineseStudios.some(c => s.includes(c))))
        return "China";
    return "Unknown";
}
