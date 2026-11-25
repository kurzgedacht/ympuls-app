import { icon, N, R, S, W, GOLD } from "./icons";

/** Illustration specs used in content-src. Every spec renders to a 400×400 SVG following CLAUDE.md §9. */
type Ic = { icon: string; label: string; value?: string };
export type Art =
  | { t: "hero"; icon: string; label?: string; icons?: string[] }
  | { t: "curve"; shape: Shape; ref?: Shape; x?: string; y?: string; label?: string; refLabel?: string; mark?: { at: number; label: string } }
  | { t: "bars"; bars: { label: string; value: number; display?: string }[]; hi?: number; title?: string }
  | { t: "compare"; left: Ic; right: Ic; win?: "left" | "right"; vs?: string }
  | { t: "flow"; steps: Ic[]; loop?: boolean }
  | { t: "scale"; left: Ic; right: Ic; heavy: "left" | "right" }
  | { t: "pyramid"; layers: string[]; icon?: string }
  | { t: "venn"; a: string; b: string; mid: string }
  | { t: "timeline"; items: { label: string; sub?: string }[]; icon?: string }
  | { t: "ba"; before: Ic; after: Ic }
  | { t: "zoom"; icon: string; label: string; detail: string }
  | { t: "number"; value: string; label: string; icon?: string; sub?: string }
  | { t: "dots"; total: number; hi: number; label: string; sub?: string }
  | { t: "scene"; items: { icon: string; x: number; y: number; s?: number; a?: boolean; step?: number }[]; labels?: { text: string; x: number; y: number; step?: number }[]; ground?: boolean }
  | { t: "stack"; items: string[]; label?: string; icon?: string }
  | { t: "gauge"; value: number; label: string; low: string; high: string }
  | { t: "list"; items: { icon: string; label: string }[]; title?: string };
export type Shape = "exp" | "log" | "lin" | "s" | "down" | "peak" | "wave" | "u" | "flat" | "zigzag" | "plateau";

const FONT = `font-family="Archivo, Arial Black, sans-serif"`;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const step = (n: number, body: string) => `<g data-step="${n}">${body}</g>`;
const textW = (t: string, size: number) => t.length * (size * 0.72 + 1) + 4;

export function pill(x: number, y: number, label: string, o: { size?: number; fill?: string; color?: string; stroke?: string; maxW?: number } = {}) {
  const up = label.toUpperCase();
  if (label.trim().split(/\s+/).length > 5) throw new Error(`label "${label}" has more than 5 words`);
  let size = o.size ?? 14;
  const maxW = o.maxW ?? 380;
  while (textW(up, size) + 26 > maxW && size > 9) size--;
  const w = textW(up, size) + 26;
  const h = size + 16;
  const cx = Math.min(Math.max(x, w / 2 + 6), 400 - w / 2 - 6);
  return `<rect x="${(cx - w / 2).toFixed(1)}" y="${(y - h / 2).toFixed(1)}" width="${w.toFixed(1)}" height="${h}" rx="${h / 2}" fill="${o.fill ?? W}" stroke="${o.stroke ?? N}" stroke-width="2.5"/>` +
    `<text x="${cx.toFixed(1)}" y="${(y + 0.5).toFixed(1)}" ${FONT} font-weight="800" font-size="${size}" letter-spacing="1" fill="${o.color ?? N}" text-anchor="middle" dominant-baseline="central">${esc(up)}</text>`;
}
const bigText = (x: number, y: number, t: string, size: number, fill = N) => {
  while (textW(t, size) > 360 && size > 18) size -= 2;
  return `<text x="${x}" y="${y}" ${FONT} font-weight="900" font-size="${size}" fill="${fill}" text-anchor="middle" dominant-baseline="central">${esc(t)}</text>`;
};
const arrow = (x1: number, y1: number, x2: number, y2: number, color = N) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 12;
  const p = (d: number) => `${(x2 - h * Math.cos(a + d)).toFixed(1)} ${(y2 - h * Math.sin(a + d)).toFixed(1)}`;
  return `<path d="M${x1} ${y1} L${x2} ${y2} M${p(0.5)} L${x2} ${y2} L${p(-0.5)}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
};

const shapes: Record<Shape, (t: number) => number> = {
  exp: (t) => (Math.exp(3.2 * t) - 1) / (Math.exp(3.2) - 1),
  log: (t) => Math.log(1 + 9 * t) / Math.log(10),
  lin: (t) => t,
  s: (t) => 1 / (1 + Math.exp(-10 * (t - 0.5))),
  down: (t) => 1 - (Math.log(1 + 9 * t) / Math.log(10)) * 0.9,
  peak: (t) => Math.exp(-Math.pow((t - 0.5) / 0.2, 2)),
  wave: (t) => 0.5 + 0.35 * Math.sin(t * Math.PI * 3),
  u: (t) => 0.15 + 3.2 * Math.pow(t - 0.5, 2),
  flat: () => 0.4,
  zigzag: (t) => 0.2 + 0.6 * t + 0.12 * Math.sin(t * Math.PI * 8),
  plateau: (t) => Math.min(1, 1.6 * t) * 0.8,
};
const X0 = 60, X1 = 360, Y0 = 320, Y1 = 70;
function curvePath(sh: Shape) {
  const pts = Array.from({ length: 41 }, (_, i) => {
    const t = i / 40;
    return `${(X0 + t * (X1 - X0)).toFixed(1)} ${(Y0 - shapes[sh](t) * (Y0 - Y1)).toFixed(1)}`;
  });
  return `M${pts.join(" L")}`;
}
const curveY = (sh: Shape, t: number) => Y0 - shapes[sh](t) * (Y0 - Y1);

const r: { [K in Art["t"]]: (a: Extract<Art, { t: K }>, c: string) => string } = {
  hero: (a, c) => {
    const ring = `<circle cx="200" cy="190" r="128" fill="${W}" stroke="${N}" stroke-width="4"/>` + `<circle cx="200" cy="190" r="104" fill="${c}" opacity=".18"/>`;
    const extras = (a.icons ?? []).slice(0, 2).map((n, i) => step(1, icon(n, i ? 340 : 60, 300, 64, { c })));
    return ring + icon(a.icon, 200, 190, 150, { c }) + `<circle cx="306" cy="92" r="20" fill="${R}"/>` + extras.join("") + (a.label ? step(2, pill(200, 352, a.label)) : "");
  },
  curve: (a, c) => {
    const axes = `<path d="M${X0} ${Y1 - 20} L${X0} ${Y0} L${X1 + 20} ${Y0}" fill="none" stroke="${N}" stroke-width="5" stroke-linecap="round"/>` +
      (a.y ? pill(X0 + 70, 40, a.y, { size: 12 }) : "") + (a.x ? pill(X1 - 50, Y0 + 40, a.x, { size: 12 }) : "");
    const ref = a.ref ? step(1, `<path d="${curvePath(a.ref)}" fill="none" stroke="${c === N ? "#1D3E6B" : c}" stroke-width="5" stroke-dasharray="2 12" stroke-linecap="round"/>` + (a.refLabel ? pill(150, curveY(a.ref, 0.3) - 34, a.refLabel, { size: 12 }) : "")) : "";
    const main = step(a.ref ? 2 : 1, `<path d="${curvePath(a.shape)}" fill="none" stroke="${R}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` + `<circle cx="${X1}" cy="${curveY(a.shape, 1).toFixed(1)}" r="9" fill="${R}"/>`);
    const markT = a.mark?.at ?? 0.75;
    const label = a.label || a.mark ? step(a.ref ? 3 : 2,
      (a.mark ? `<path d="M${X0 + markT * (X1 - X0)} ${Y0} L${X0 + markT * (X1 - X0)} ${curveY(a.shape, markT)}" stroke="${N}" stroke-width="3" stroke-dasharray="6 8"/>` + pill(X0 + markT * (X1 - X0), Math.max(curveY(a.shape, markT) - 34, 30), a.mark.label) : "") +
      (a.label && !a.mark ? pill(Math.min(X0 + 0.55 * (X1 - X0), 280), Math.max(curveY(a.shape, 0.55) - 40, 30), a.label) : "")) : "";
    return axes + ref + main + label;
  },
  bars: (a, c) => {
    const n = a.bars.length, max = Math.max(...a.bars.map((b) => b.value));
    const gap = 300 / n, bw = Math.min(70, gap * 0.62);
    const base = `<path d="M40 320 L360 320" stroke="${N}" stroke-width="5" stroke-linecap="round"/>` + (a.title ? pill(200, 36, a.title) : "");
    return base + a.bars.map((b, i) => {
      const h = (b.value / max) * 220, x = 50 + gap * i + (gap - bw) / 2, hi = i === (a.hi ?? n - 1);
      return step(i + 1, `<rect x="${x.toFixed(1)}" y="${(320 - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="8" fill="${hi ? R : i % 2 ? c : S}" stroke="${N}" stroke-width="3.5"/>` +
        bigText(x + bw / 2, 320 - h - 20, b.display ?? String(b.value), 20, hi ? R : N) +
        `<text x="${(x + bw / 2).toFixed(1)}" y="345" ${FONT} font-weight="800" font-size="${n > 4 ? 11 : 13}" letter-spacing="1" fill="${N}" text-anchor="middle">${esc(b.label.toUpperCase())}</text>`);
    }).join("");
  },
  compare: (a, c) => {
    const side = (s: Ic, x: number, win: boolean, n: number) => step(n,
      `<rect x="${x - 82}" y="70" width="164" height="230" rx="24" fill="${win ? W : S}" stroke="${N}" stroke-width="4"/>` +
      icon(s.icon, x, 160, 110, { c, a: win }) + (s.value ? bigText(x, 250, s.value, 30, win ? R : N) : "") + pill(x, 330, s.label, { size: 13, maxW: 180 }));
    return side(a.left, 108, a.win === "left", 1) + side(a.right, 292, a.win === "right", 2) +
      `<circle cx="200" cy="185" r="22" fill="${N}"/><text x="200" y="186" ${FONT} font-weight="900" font-size="15" fill="${W}" text-anchor="middle" dominant-baseline="central">${esc(a.vs ?? "VS")}</text>`;
  },
  flow: (a, c) => {
    const n = a.steps.length;
    if (a.loop) {
      const pos = Array.from({ length: n }, (_, i) => {
        const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
        return [200 + 118 * Math.cos(ang), 195 + 118 * Math.sin(ang)];
      });
      const ring = `<circle cx="200" cy="195" r="118" fill="none" stroke="${N}" stroke-width="4" stroke-dasharray="4 12" stroke-linecap="round"/>`;
      return ring + a.steps.map((s, i) => {
        const [x, y] = pos[i];
        return step(i + 1, `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="42" fill="${i === n - 1 ? W : S}" stroke="${N}" stroke-width="4"/>` +
          icon(s.icon, x, y, 58, { c, a: i === n - 1 }) + pill(x, y + 58 > 380 ? y - 58 : y + 58, s.label, { size: 12, maxW: 170 }));
      }).join("");
    }
    const gap = 330 / n;
    return a.steps.map((s, i) => {
      const y = 50 + gap * i + gap / 2 - 10;
      const last = i === n - 1;
      return step(i + 1, `<circle cx="96" cy="${y}" r="${Math.min(44, gap / 2 - 6)}" fill="${last ? W : S}" stroke="${N}" stroke-width="4"/>` +
        icon(s.icon, 96, y, Math.min(60, gap - 30), { c, a: last }) + pill(270, y, s.label, { size: 13, fill: last ? R : W, color: last ? W : N, stroke: last ? R : N }) +
        (i < n - 1 ? arrow(96, y + gap / 2 - 2, 96, y + gap / 2 + 14) : ""));
    }).join("");
  },
  scale: (a, c) => {
    const tilt = a.heavy === "left" ? -12 : 12;
    const beam = (x: number) => (x - 200) * Math.tan((tilt * Math.PI) / 180) * -1;
    const lx = 90, rx = 310, ly = 140 + beam(lx) * -1, ry = 140 + beam(rx) * -1;
    const pan = (x: number, y: number, s: Ic, heavy: boolean) => `<path d="M${x} ${y} L${x - 50} ${y + 70} M${x} ${y} L${x + 50} ${y + 70}" stroke="${N}" stroke-width="3"/>` +
      `<path d="M${x - 64} ${y + 70} L${x + 64} ${y + 70} A64 30 0 0 1 ${x - 64} ${y + 70}Z" fill="${heavy ? W : S}" stroke="${N}" stroke-width="4"/>` +
      icon(s.icon, x, y + 40, 62, { c, a: heavy }) + pill(x, y + 128, s.label, { size: 12, maxW: 180 });
    return `<path d="M200 140 L200 340 M140 350 L260 350" stroke="${N}" stroke-width="6" stroke-linecap="round"/><path d="M175 350 L200 300 L225 350Z" fill="${N}"/>` +
      `<path d="M${lx} ${ly} L${rx} ${ry}" stroke="${N}" stroke-width="6" stroke-linecap="round"/><circle cx="200" cy="140" r="10" fill="${R}"/>` +
      step(1, pan(lx, ly, a.left, a.heavy === "left")) + step(2, pan(rx, ry, a.right, a.heavy === "right"));
  },
  pyramid: (a, c) => {
    const n = a.layers.length, h = 260 / n;
    return a.layers.map((l, i) => {
      const yb = 340 - i * h, yt = yb - h + 6;
      const half = (y: number) => ((y - 70) / 270) * 170;
      const top = i === n - 1;
      return step(i + 1, `<path d="M${200 - half(yb)} ${yb} L${200 + half(yb)} ${yb} L${200 + half(yt)} ${yt} L${200 - half(yt)} ${yt}Z" fill="${top ? R : i % 2 ? c : S}" stroke="${N}" stroke-width="4" stroke-linejoin="round"/>` +
        pill(200, yb - h / 2 + 3, l, { size: top ? 11 : 13 }));
    }).join("") + (a.icon ? icon(a.icon, 340, 70, 60, { c }) : "");
  },
  venn: (a, c) => `<circle cx="150" cy="190" r="110" fill="${S}" stroke="${N}" stroke-width="4" opacity=".95"/>` +
    step(1, `<circle cx="250" cy="190" r="110" fill="${c}" fill-opacity=".35" stroke="${N}" stroke-width="4"/>`) +
    pill(110, 64, a.a, { size: 12 }) + step(1, pill(290, 316, a.b, { size: 12 })) +
    step(2, `<circle cx="200" cy="190" r="16" fill="${R}"/>` + pill(200, 372, a.mid) + `<path d="M200 206 L200 354" stroke="${N}" stroke-width="3" stroke-dasharray="5 7"/>`),
  timeline: (a, c) => {
    const n = a.items.length, gap = 280 / Math.max(1, n - 1);
    return `<path d="M60 200 L340 200" stroke="${N}" stroke-width="5" stroke-linecap="round"/>` + (a.icon ? icon(a.icon, 200, 345, 64, { c }) : "") +
      a.items.map((it, i) => {
        const x = 60 + gap * i, last = i === n - 1, up = i % 2 === 0;
        return step(i + 1, `<circle cx="${x}" cy="200" r="${last ? 16 : 11}" fill="${last ? R : W}" stroke="${N}" stroke-width="4"/>` +
          pill(x, up ? 250 : 150, it.label, { size: 12, maxW: 130 }) + (it.sub ? `<text x="${x}" y="${up ? 285 : 115}" ${FONT} font-weight="800" font-size="12" fill="${N}" text-anchor="middle">${esc(it.sub.toUpperCase())}</text>` : ""));
      }).join("");
  },
  ba: (a, c) => `<text x="105" y="50" ${FONT} font-weight="800" font-size="13" letter-spacing="1.5" fill="${N}" text-anchor="middle">VORHER</text>` +
    `<rect x="25" y="70" width="160" height="220" rx="24" fill="${S}" stroke="${N}" stroke-width="4"/>` + icon(a.before.icon, 105, 170, 100, { c }) + pill(105, 330, a.before.label, { size: 12, maxW: 185 }) +
    step(1, arrow(190, 180, 214, 180)) +
    step(2, `<text x="295" y="50" ${FONT} font-weight="800" font-size="13" letter-spacing="1.5" fill="${N}" text-anchor="middle">NACHHER</text>` +
      `<rect x="215" y="70" width="160" height="220" rx="24" fill="${W}" stroke="${N}" stroke-width="4"/>` + icon(a.after.icon, 295, 170, 100, { c, a: true }) + pill(295, 330, a.after.label, { size: 12, maxW: 185 })),
  zoom: (a, c) => icon(a.icon, 130, 230, 170, { c }) + pill(130, 352, a.label, { size: 13 }) +
    step(1, `<circle cx="170" cy="250" r="26" fill="none" stroke="${N}" stroke-width="4"/><path d="M190 232 L232 180" stroke="${N}" stroke-width="3" stroke-dasharray="5 7"/>`) +
    step(2, `<circle cx="285" cy="125" r="88" fill="${W}" stroke="${N}" stroke-width="6"/><path d="M220 186 L196 214" stroke="${N}" stroke-width="12" stroke-linecap="round"/>` +
      bigText(285, 125, a.detail, 34, R)),
  number: (a, c) => (a.icon ? icon(a.icon, 200, 105, 120, { c }) : `<circle cx="200" cy="105" r="46" fill="${c}" opacity=".3"/>`) +
    step(1, bigText(200, 230, a.value, 72, R)) + step(2, pill(200, 310, a.label) + (a.sub ? `<text x="200" y="355" ${FONT} font-weight="800" font-size="13" letter-spacing="1" fill="${N}" text-anchor="middle">${esc(a.sub.toUpperCase())}</text>` : "")),
  dots: (a) => {
    const cols = a.total <= 20 ? 5 : 10, rows = Math.ceil(a.total / cols), size = cols === 5 ? 44 : 24;
    const ox = 200 - ((cols - 1) * size) / 2, oy = 60;
    const all = Array.from({ length: a.total }, (_, i) => `<circle cx="${ox + (i % cols) * size}" cy="${oy + Math.floor(i / cols) * size}" r="${size * 0.36}" fill="${S}" stroke="${N}" stroke-width="2.5"/>`).join("");
    const hi = Array.from({ length: a.hi }, (_, i) => `<circle cx="${ox + (i % cols) * size}" cy="${oy + Math.floor(i / cols) * size}" r="${size * 0.36}" fill="${R}" stroke="${N}" stroke-width="2.5"/>`).join("");
    const by = oy + rows * size + 20;
    return all + step(1, hi) + step(2, pill(200, Math.min(by + 14, 345), a.label) + (a.sub ? `<text x="200" y="${Math.min(by + 52, 385)}" ${FONT} font-weight="800" font-size="12" letter-spacing="1" fill="${N}" text-anchor="middle">${esc(a.sub.toUpperCase())}</text>` : ""));
  },
  scene: (a, c) => (a.ground ? `<path d="M20 330 L380 330" stroke="${N}" stroke-width="5" stroke-linecap="round"/>` : "") +
    a.items.map((it) => { const g = icon(it.icon, it.x, it.y, it.s ?? 90, { c, a: it.a }); return it.step ? step(it.step, g) : g; }).join("") +
    (a.labels ?? []).map((l) => (l.step ? step(l.step, pill(l.x, l.y, l.text, { size: 13 })) : pill(l.x, l.y, l.text, { size: 13 }))).join(""),
  stack: (a, c) => {
    const n = a.items.length, h = Math.min(56, 240 / n);
    return (a.label ? pill(200, 36, a.label) : "") + (a.icon ? icon(a.icon, 340, 330, 60, { c }) : "") + a.items.map((it, i) => {
      const y = 330 - (i + 1) * (h + 8), top = i === n - 1;
      return step(i + 1, `<rect x="${70 + i * 8}" y="${y}" width="${260 - i * 16}" height="${h}" rx="14" fill="${top ? R : i % 2 ? c : S}" stroke="${N}" stroke-width="4"/>` +
        `<text x="200" y="${y + h / 2}" ${FONT} font-weight="800" font-size="14" letter-spacing="1" fill="${top ? W : N}" text-anchor="middle" dominant-baseline="central">${esc(it.toUpperCase())}</text>`);
    }).join("");
  },
  gauge: (a, c) => {
    const ang = Math.PI * (1 - Math.max(0, Math.min(1, a.value)));
    const nx = 200 + 120 * Math.cos(ang), ny = 250 - 120 * Math.sin(ang);
    return `<path d="M50 250 A150 150 0 0 1 350 250" fill="none" stroke="${S}" stroke-width="34"/>` + `<path d="M50 250 A150 150 0 0 1 200 100" fill="none" stroke="${c}" stroke-width="34" opacity=".5"/>` +
      `<path d="M50 250 A150 150 0 0 1 350 250" fill="none" stroke="${N}" stroke-width="4"/>` + pill(70, 300, a.low, { size: 12 }) + pill(330, 300, a.high, { size: 12 }) +
      step(1, `<path d="M200 250 L${nx.toFixed(1)} ${ny.toFixed(1)}" stroke="${R}" stroke-width="8" stroke-linecap="round"/><circle cx="200" cy="250" r="14" fill="${N}"/>`) + step(2, pill(200, 350, a.label));
  },
  list: (a, c) => {
    const n = a.items.length, gap = Math.min(80, 300 / n), oy = a.title ? 80 : 60;
    return (a.title ? pill(200, 36, a.title) : "") + a.items.map((it, i) => {
      const y = oy + i * gap + gap / 2 - 10, last = i === n - 1;
      return step(i + 1, `<rect x="30" y="${y - gap / 2 + 6}" width="340" height="${gap - 12}" rx="${(gap - 12) / 2}" fill="${last ? W : S}" stroke="${N}" stroke-width="3.5"/>` +
        icon(it.icon, 70, y, gap - 26, { c, a: last }) +
        `<text x="105" y="${y}" ${FONT} font-weight="800" font-size="14" letter-spacing="1" fill="${N}" dominant-baseline="central">${esc(it.label.toUpperCase())}</text>`);
    }).join("");
  },
};

export function renderArt(a: Art, catColor: string): string {
  const body = (r[a.t] as (x: Art, c: string) => string)(a, catColor);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">${body}</svg>`;
}

/** Course cover: category colour, white disc with icon, the red dot as single accent. */
export function renderCover(iconName: string, catColor: string) {
  const dot = catColor.toUpperCase() === R ? `<circle cx="318" cy="84" r="26" fill="${W}"/><circle cx="318" cy="84" r="17" fill="${R}"/>` : `<circle cx="318" cy="84" r="22" fill="${R}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="${catColor}"/>` +
    `<circle cx="80" cy="360" r="120" fill="${W}" opacity=".08"/><circle cx="200" cy="205" r="125" fill="${W}" stroke="${N}" stroke-width="5"/>` +
    icon(iconName, 200, 205, 150, { c: catColor === N ? GOLD : catColor }) + dot + `</svg>`;
}
