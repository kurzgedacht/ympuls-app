// Combines screenshots into one contact sheet for quick review: node scripts/montage.mjs out.png a.png b.png …
import { readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";
const [out, ...files] = process.argv.slice(2);
const w = 393, h = 852, cols = Math.min(4, files.length), rows = Math.ceil(files.length / cols);
const imgs = files.map((f, i) => `<image x="${(i % cols) * (w + 10)}" y="${Math.floor(i / cols) * (h + 10)}" width="${w}" height="${h}" href="data:image/png;base64,${readFileSync(f).toString("base64")}"/>`);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${cols * (w + 10)}" height="${rows * (h + 10)}"><rect width="100%" height="100%" fill="#888"/>${imgs.join("")}</svg>`;
writeFileSync(out, new Resvg(svg, { fitTo: { mode: "width", value: Math.min(1600, cols * 403) } }).render().asPng());
