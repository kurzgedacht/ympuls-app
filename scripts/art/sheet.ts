// Contact sheet of all SVGs in a content folder: npx tsx scripts/art/sheet.ts content/courses/<slug> out.png
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
const [dir, out, filter] = process.argv.slice(2);
const files = [join(dir, "cover.svg"), ...readdirSync(join(dir, "art")).sort().map((f) => join(dir, "art", f))].filter((f) => existsSync(f) && (!filter || f.includes(filter)));
const cols = 5, cell = 400;
const body = files.map((f, i) => {
  const x = (i % cols) * cell, y = Math.floor(i / cols) * (cell + 24);
  const inner = readFileSync(f, "utf8").replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  return `<rect x="${x + 4}" y="${y + 4}" width="${cell - 8}" height="${cell - 8}" rx="24" fill="#D6DEEA"/><svg x="${x}" y="${y}" width="${cell}" height="${cell}" viewBox="0 0 400 400">${inner}</svg><text x="${x + 10}" y="${y + cell + 16}" font-size="16" font-family="Arial">${f.split("/").pop()}</text>`;
});
const H = Math.ceil(files.length / cols) * (cell + 24);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cols * cell}" height="${H}"><rect width="100%" height="100%" fill="#fff"/>${body.join("")}</svg>`;
writeFileSync(out, new Resvg(svg, { fitTo: { mode: "width", value: 1500 }, font: { defaultFontFamily: "Arial Black" } }).render().asPng());
console.log(`${files.length} images → ${out}`);
