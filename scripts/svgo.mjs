// Optimises every SVG under content/ in place. data-step groups must survive, so group collapsing is off.
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { optimize } from "svgo";

export const svgoConfig = {
  multipass: true,
  plugins: [{ name: "preset-default", params: { overrides: { convertColors: false, collapseGroups: false, moveGroupAttrsToElems: false, removeUnknownsAndDefaults: { keepDataAttrs: true } } } }],
};
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
let saved = 0;
for (const f of walk("content").filter((f) => f.endsWith(".svg"))) {
  const src = readFileSync(f, "utf8");
  const { data } = optimize(src, { path: f, ...svgoConfig });
  if (data.length < src.length) { saved += src.length - data.length; writeFileSync(f, data); }
}
console.log(`svgo: saved ${(saved / 1024).toFixed(1)} KB`);
