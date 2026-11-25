// Renders app icons and iOS startup images from brand/ (npm run assets). Also injects the <link> tags into index.html.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const png = (svg, w, out) => writeFileSync(out, new Resvg(svg, { fitTo: { mode: "width", value: w } }).render().asPng());
mkdirSync("public/icons", { recursive: true });
mkdirSync("public/splash", { recursive: true });

const appicon = readFileSync("brand/ympuls-appicon.svg", "utf8");
png(appicon, 180, "public/icons/apple-touch-icon.png");
png(appicon, 192, "public/icons/icon-192.png");
png(appicon, 512, "public/icons/icon-512.png");
png(appicon, 64, "public/icons/favicon.png");

const inner = (f) => readFileSync(f, "utf8").replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const iconInner = inner("brand/ympuls-appicon.svg").replace(/<rect[^>]*\/>/, ""); // signet glyph without its square
const signet = inner("brand/ympuls-signet.svg");

// [css width, css height, device pixel ratio]
const devices = [[375, 667, 2], [375, 812, 3], [390, 844, 3], [393, 852, 3], [402, 874, 3], [428, 926, 3], [430, 932, 3], [440, 956, 3]];
const tags = [];
for (const [w, h, r] of devices) {
  for (const theme of ["light", "dark"]) {
    const W = w * r, H = h * r, s = Math.round(W * 0.34);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${theme === "light" ? "#002144" : "#08142A"}"/>` +
      `<svg x="${(W - s) / 2}" y="${(H - s) / 2}" width="${s}" height="${s}" viewBox="0 0 1024 1024">${theme === "light" ? iconInner : signet}</svg></svg>`;
    const file = `splash/${W}x${H}-${theme}.png`;
    png(svg, W, `public/${file}`);
    tags.push(`<link rel="apple-touch-startup-image" media="screen and (device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${r}) and (orientation: portrait) and (prefers-color-scheme: ${theme})" href="${file}" />`);
  }
}
const html = readFileSync("index.html", "utf8");
writeFileSync("index.html", html.replace(/<!-- splash:start -->[\s\S]*<!-- splash:end -->/, `<!-- splash:start -->\n    ${tags.join("\n    ")}\n    <!-- splash:end -->`));
console.log(`icons + ${tags.length} startup images written`);
