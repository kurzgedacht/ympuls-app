// Flat editorial icons on a 100×100 grid. N = navy outline/shape, R = the one red accent, S = ice blue, W = white, C = category colour.
export const N = "#002144";
export const R = "#D11F3A";
export const S = "#D6DEEA";
export const W = "#FFFFFF";
export const GOLD = "#F2B84B";

type Ctx = { c: string; a: boolean }; // c = category colour, a = draw the red accent on this icon
const sk = `stroke="${N}" stroke-linecap="round" stroke-linejoin="round"`;
const line = (d: string, w = 6) => `<path d="${d}" fill="none" ${sk} stroke-width="${w}"/>`;
const shape = (d: string, fill: string) => `<path d="${d}" fill="${fill}" ${sk} stroke-width="3.5"/>`;
const circ = (x: number, y: number, r: number, fill: string) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${sk} stroke-width="3.5"/>`;
const rect = (x: number, y: number, w: number, h: number, rx: number, fill: string) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${sk} stroke-width="3.5"/>`;
const txt = (x: number, y: number, s: string, size: number, fill = N) =>
  `<text x="${x}" y="${y}" font-family="Archivo, Arial Black, sans-serif" font-weight="900" font-size="${size}" fill="${fill}" text-anchor="middle" dominant-baseline="central">${s}</text>`;
const acc = (k: Ctx, alt: string) => (k.a ? R : alt);

function gearPath(cx: number, cy: number, r1: number, r2: number, teeth: number) {
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const r = i % 2 ? r1 : r2;
    for (const off of [-0.22, 0.22]) {
      const ang = ((i + 0.5 + off) / (teeth * 2)) * Math.PI * 2;
      pts.push(`${(cx + r * Math.cos(ang)).toFixed(1)} ${(cy + r * Math.sin(ang)).toFixed(1)}`);
    }
  }
  return `M${pts.join(" L")}Z`;
}
function starPath(cx: number, cy: number, r1: number, r2: number) {
  return "M" + Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 ? r2 : r1;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" L") + "Z";
}

export const ICONS: Record<string, (k: Ctx) => string> = {
  person: (k) => circ(50, 24, 13, acc(k, N)) + shape("M27 92 V66 a23 23 0 0 1 46 0 V92 Z", N),
  people: (k) => circ(32, 30, 11, N) + shape("M13 90 V68 a19 19 0 0 1 38 0 V90Z", N) + circ(68, 30, 11, acc(k, N)) + shape("M49 90 V68 a19 19 0 0 1 38 0 V90Z", S),
  runner: (k) => circ(62, 16, 9, acc(k, N)) + line("M57 30 L46 56 M54 36 L68 46 L76 40 M54 36 L38 42 L32 52 M46 56 L60 72 L56 92 M46 56 L34 72 L18 70", 8),
  bike: (k) => circ(24, 68, 17, W) + circ(76, 68, 17, W) + line("M24 68 L44 42 L72 42 L76 68 M44 42 L52 68 L24 68 M52 68 L72 42 M38 36 L50 36 M72 42 L68 30 L78 30", 5) + `<circle cx="52" cy="68" r="4" fill="${acc(k, N)}"/>`,
  dumbbell: (k) => line("M24 50 L76 50", 8) + rect(10, 30, 12, 40, 4, acc(k, N)) + rect(78, 30, 12, 40, 4, acc(k, N)) + rect(22, 36, 8, 28, 3, S) + rect(70, 36, 8, 28, 3, S),
  coin: (k) => circ(50, 50, 32, k.a ? R : GOLD) + circ(50, 50, 23, "none") + txt(50, 52, "€", 30, k.a ? W : N),
  coins: (k) => [78, 64, 50].map((y) => `<ellipse cx="44" cy="${y}" rx="26" ry="9" fill="${GOLD}" ${sk} stroke-width="3.5"/>`).join("") + circ(72, 36, 18, acc(k, GOLD)) + txt(72, 37, "€", 18, k.a ? W : N),
  piggy: (k) => shape("M22 50 a30 24 0 1 1 56 6 L84 52 L84 64 L76 64 a30 24 0 0 1 -12 12 L64 88 L54 88 L54 80 L42 80 L42 88 L32 88 L32 76 a30 24 0 0 1 -10 -26Z", S) + shape("M34 34 L30 20 L44 28Z", S) + `<circle cx="66" cy="46" r="3.5" fill="${N}"/>` + line("M44 32 L58 32", 5) + `<circle cx="51" cy="18" r="8" fill="${acc(k, GOLD)}" ${sk} stroke-width="3"/>`,
  phone: (k) => rect(30, 10, 40, 80, 9, W) + rect(36, 20, 28, 52, 4, S) + `<circle cx="50" cy="81" r="3.5" fill="${N}"/>` + `<circle cx="58" cy="30" r="5" fill="${acc(k, k.c)}"/>`,
  brain: (k) => shape("M50 24 C36 12 16 24 22 40 C10 48 14 68 30 68 C32 82 48 84 50 74 C52 84 68 82 70 68 C86 68 90 48 78 40 C84 24 64 12 50 24Z", S) + line("M50 26 L50 72 M34 42 C40 44 42 50 40 56 M66 42 C60 44 58 50 60 56", 4) + `<circle cx="64" cy="30" r="5" fill="${acc(k, N)}"/>`,
  heart: (k) => shape("M50 84 C20 64 10 46 18 32 C26 18 44 20 50 34 C56 20 74 18 82 32 C90 46 80 64 50 84Z", acc(k, k.c)),
  battery: (k) => rect(14, 32, 66, 36, 7, W) + rect(80, 42, 8, 16, 3, N) + `<rect x="21" y="39" width="${k.a ? 18 : 44}" height="22" rx="3" fill="${k.a ? R : k.c}"/>`,
  clock: (k) => circ(50, 50, 36, W) + line("M50 50 L50 26 M50 50 L66 60", 6) + `<circle cx="50" cy="50" r="5" fill="${acc(k, N)}"/>`,
  book: (k) => shape("M50 28 C40 20 22 20 12 25 V78 C22 73 40 73 50 81 Z", W) + shape("M50 28 C60 20 78 20 88 25 V78 C78 73 60 73 50 81 Z", S) + line("M20 36 C28 33 36 33 42 36 M20 48 C28 45 36 45 42 48", 3) + (k.a ? `<path d="M70 21 L70 46 L76 40 L82 46 L82 22" fill="${R}"/>` : ""),
  rocket: (k) => shape("M50 8 C66 24 68 50 62 70 H38 C32 50 34 24 50 8Z", W) + circ(50, 38, 8, S) + shape("M38 56 L24 72 L36 72Z", k.c) + shape("M62 56 L76 72 L64 72Z", k.c) + `<path d="M42 74 L50 94 L58 74Z" fill="${acc(k, GOLD)}"/>`,
  chart: (k) => line("M14 14 L14 86 L88 86", 5) + rect(24, 62, 12, 24, 2, S) + rect(44, 48, 12, 38, 2, S) + rect(64, 32, 12, 54, 2, k.a ? R : k.c),
  growth: (k) => line("M14 14 L14 86 L88 86", 5) + `<path d="M20 78 C44 74 60 60 82 22" fill="none" stroke="${acc(k, k.c)}" stroke-width="6" stroke-linecap="round"/>` + `<path d="M70 22 L84 18 L84 34" fill="none" stroke="${acc(k, k.c)}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,
  bulb: (k) => circ(50, 40, 24, k.a ? R : GOLD) + rect(40, 64, 20, 18, 4, W) + line("M44 90 L56 90 M50 8 L50 4 M20 22 L16 18 M80 22 L84 18", 4),
  moon: (k) => shape("M58 14 A36 36 0 1 0 86 62 A28 28 0 1 1 58 14Z", N) + `<circle cx="28" cy="26" r="4" fill="${acc(k, N)}"/>`,
  sun: (k) => circ(50, 50, 20, k.a ? R : GOLD) + line("M50 12 L50 20 M50 80 L50 88 M12 50 L20 50 M80 50 L88 50 M23 23 L29 29 M71 71 L77 77 M23 77 L29 71 M71 29 L77 23", 5),
  apple: (k) => shape("M50 32 C36 22 16 28 18 52 C20 74 36 90 50 82 C64 90 80 74 82 52 C84 28 64 22 50 32Z", acc(k, k.c)) + line("M50 32 C50 24 52 18 56 14", 4) + shape("M54 22 C60 12 72 12 74 16 C68 24 60 24 54 22Z", S),
  plate: (k) => circ(50, 52, 32, W) + circ(50, 52, 20, S) + line("M8 24 L8 82 M4 24 L4 38 C4 42 12 42 12 38 L12 24 M92 24 C84 30 84 46 92 50 L92 82", 4) + `<circle cx="50" cy="52" r="7" fill="${acc(k, k.c)}"/>`,
  chip: (k) => line("M38 14 L38 26 M50 14 L50 26 M62 14 L62 26 M38 74 L38 86 M50 74 L50 86 M62 74 L62 86 M14 38 L26 38 M14 50 L26 50 M14 62 L26 62 M74 38 L86 38 M74 50 L86 50 M74 62 L86 62", 4) + rect(26, 26, 48, 48, 6, W) + rect(38, 38, 24, 24, 3, acc(k, k.c)),
  wifi: (k) => line("M14 40 C34 20 66 20 86 40 M26 54 C40 40 60 40 74 54 M38 66 C46 59 54 59 62 66", 6) + `<circle cx="50" cy="78" r="6" fill="${acc(k, N)}"/>`,
  house: (k) => shape("M16 48 L50 18 L84 48 L84 88 L16 88Z", W) + rect(42, 62, 16, 26, 2, acc(k, k.c)) + rect(24, 54, 12, 12, 2, S),
  target: (k) => circ(50, 50, 38, W) + circ(50, 50, 26, S) + circ(50, 50, 13, W) + `<circle cx="50" cy="50" r="6" fill="${acc(k, N)}"/>`,
  cash: (k) => rect(10, 30, 80, 42, 6, W) + circ(50, 51, 12, S) + txt(50, 52, "€", 15) + `<circle cx="22" cy="40" r="4" fill="${acc(k, k.c)}"/>`,
  moneybag: (k) => shape("M38 22 L62 22 L56 34 C76 42 86 60 82 74 C80 86 70 90 50 90 C30 90 20 86 18 74 C14 60 24 42 44 34Z", acc(k, GOLD)) + line("M40 34 L60 34", 4) + txt(50, 64, "€", 26, k.a ? W : N),
  calendar: (k) => rect(14, 20, 72, 66, 8, W) + `<rect x="14" y="20" width="72" height="18" rx="8" fill="${N}"/>` + line("M30 12 L30 26 M70 12 L70 26", 5) + [30, 50, 70].flatMap((x) => [52, 70].map((y) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${x === 70 && y === 70 ? acc(k, S) : S}"/>`)).join(""),
  mountain: (k) => shape("M6 86 L38 30 L56 58 L66 44 L94 86Z", S) + line("M38 30 L38 12", 4) + `<path d="M38 12 L54 17 L38 22Z" fill="${acc(k, k.c)}"/>`,
  ball: (k) => circ(50, 50, 36, W) + shape("M50 36 L63 45 L58 61 L42 61 L37 45Z", acc(k, N)) + line("M50 36 L50 16 M63 45 L82 38 M58 61 L70 78 M42 61 L30 78 M37 45 L18 38", 3),
  moto: (k) => circ(22, 70, 15, W) + circ(78, 70, 15, W) + shape("M22 70 L40 48 L64 48 L78 70 L52 70Z", acc(k, k.c)) + line("M64 48 L70 32 L80 32 M40 48 L34 40 L46 40", 5),
  cup: (k) => shape("M22 30 L72 30 L66 84 L28 84Z", W) + line("M72 42 C88 42 88 64 70 64", 5) + line("M38 22 C34 16 42 12 38 6 M54 22 C50 16 58 12 54 6", 4) + `<rect x="27" y="44" width="40" height="8" fill="${acc(k, k.c)}"/>`,
  bed: (k) => line("M10 30 L10 84 M90 60 L90 84 M10 72 L90 72", 6) + rect(16, 42, 22, 14, 6, W) + shape("M40 46 L90 46 L90 64 L40 64Z", acc(k, S)),
  laptop: (k) => rect(20, 22, 60, 42, 5, W) + rect(27, 29, 46, 28, 2, S) + shape("M10 72 L90 72 L84 82 L16 82Z", N) + `<circle cx="64" cy="38" r="5" fill="${acc(k, k.c)}"/>`,
  gear: (k) => shape(gearPath(50, 50, 30, 40, 8), W) + circ(50, 50, 12, acc(k, S)),
  lock: (k) => line("M34 46 L34 32 a16 16 0 0 1 32 0 L66 46", 6) + rect(22, 46, 56, 42, 8, W) + `<circle cx="50" cy="64" r="6" fill="${acc(k, N)}"/>`,
  flag: (k) => line("M24 10 L24 92", 6) + shape("M24 14 L80 22 L64 38 L80 54 L24 50Z", acc(k, k.c)),
  egg: (k) => `<ellipse cx="50" cy="54" rx="28" ry="36" fill="${W}" ${sk} stroke-width="3.5"/>` + `<circle cx="50" cy="60" r="13" fill="${acc(k, GOLD)}"/>`,
  drop: (k) => shape("M50 10 C62 32 78 46 78 62 A28 28 0 0 1 22 62 C22 46 38 32 50 10Z", acc(k, S)),
  fire: (k) => shape("M50 8 C56 28 76 36 76 62 A26 26 0 0 1 24 62 C24 46 34 40 36 28 C42 36 44 42 48 44 C50 32 48 20 50 8Z", acc(k, GOLD)) + shape("M50 56 C56 64 60 68 60 74 A10 10 0 0 1 40 74 C40 68 46 64 50 56Z", W),
  star: (k) => shape(starPath(50, 52, 40, 17), acc(k, GOLD)),
  check: (k) => circ(50, 50, 36, k.a ? R : "#1E9E6A") + `<path d="M34 51 L45 62 L67 38" fill="none" stroke="${W}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
  cross: (k) => circ(50, 50, 36, acc(k, S)) + line("M36 36 L64 64 M64 36 L36 64", 7),
  question: (k) => circ(50, 50, 36, acc(k, W)) + txt(50, 53, "?", 44, k.a ? W : N),
  gift: (k) => rect(16, 44, 68, 44, 5, W) + rect(10, 30, 80, 16, 4, S) + `<rect x="44" y="30" width="12" height="58" fill="${acc(k, k.c)}"/>` + line("M50 30 C40 14 26 18 34 28 M50 30 C60 14 74 18 66 28", 4),
  bolt: (k) => shape("M56 6 L20 56 L46 56 L40 94 L80 40 L54 40Z", acc(k, GOLD)),
  eye: (k) => shape("M8 50 C28 22 72 22 92 50 C72 78 28 78 8 50Z", W) + circ(50, 50, 16, S) + `<circle cx="50" cy="50" r="7" fill="${acc(k, N)}"/>`,
  plant: (k) => line("M50 88 L50 44", 6) + shape("M50 56 C34 56 22 46 20 30 C38 30 50 40 50 56Z", k.c) + shape("M50 46 C52 30 64 20 82 20 C80 38 66 46 50 46Z", k.c) + `<circle cx="50" cy="40" r="6" fill="${acc(k, k.c)}"/>` + rect(32, 80, 36, 12, 4, S),
  snowball: (k) => circ(62, 58, 28, W) + circ(22, 78, 9, S) + line("M8 90 L92 90", 4) + `<circle cx="70" cy="48" r="5" fill="${acc(k, S)}"/>`,
  watch: (k) => rect(36, 6, 28, 20, 4, S) + rect(36, 74, 28, 20, 4, S) + rect(26, 24, 48, 52, 12, W) + `<path d="M32 52 L42 52 L47 40 L54 62 L59 52 L68 52" fill="none" stroke="${acc(k, k.c)}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
  satellite: (k) => rect(40, 40, 20, 20, 3, W) + rect(8, 42, 26, 16, 2, S) + rect(66, 42, 26, 16, 2, S) + line("M34 50 L40 50 M60 50 L66 50 M50 60 L50 70", 4) + `<circle cx="50" cy="76" r="6" fill="${acc(k, k.c)}"/>`,
  robot: (k) => rect(22, 30, 56, 46, 10, W) + line("M50 30 L50 16", 4) + `<circle cx="50" cy="14" r="5" fill="${acc(k, k.c)}"/>` + circ(38, 50, 6, S) + circ(62, 50, 6, S) + line("M40 64 L60 64", 4),
  cloud: (k) => shape("M26 74 A16 16 0 0 1 28 42 A22 22 0 0 1 70 38 A18 18 0 0 1 76 74Z", W) + `<circle cx="70" cy="58" r="5" fill="${acc(k, S)}"/>`,
  tower: (k) => line("M50 40 L34 92 M50 40 L66 92 M40 72 L60 72 M44 58 L56 58", 5) + `<circle cx="50" cy="36" r="7" fill="${acc(k, k.c)}"/>` + line("M30 22 C24 30 24 42 30 50 M70 22 C76 30 76 42 70 50", 4),
  shoe: (k) => shape("M10 72 L14 40 L30 40 C36 52 48 56 62 58 L84 62 C92 64 92 76 84 78 L14 78Z", W) + line("M10 72 L90 72", 4) + `<rect x="36" y="46" width="14" height="6" rx="3" fill="${acc(k, k.c)}"/>`,
  hourglass: (k) => line("M24 10 L76 10 M24 90 L76 90", 6) + shape("M30 14 L70 14 C70 34 54 42 54 50 C54 58 70 66 70 86 L30 86 C30 66 46 58 46 50 C46 42 30 34 30 14Z", W) + `<path d="M36 82 C40 70 60 70 64 82Z" fill="${acc(k, GOLD)}"/>`,
  key: (k) => circ(30, 50, 18, W) + line("M48 50 L88 50 M78 50 L78 64 M66 50 L66 60", 6) + `<circle cx="30" cy="50" r="6" fill="${acc(k, S)}"/>`,
  doc: (k) => shape("M24 8 L64 8 L80 24 L80 92 L24 92Z", W) + line("M34 34 L68 34 M34 48 L68 48 M34 62 L56 62", 4) + `<circle cx="66" cy="76" r="7" fill="${acc(k, k.c)}"/>`,
  cart: (k) => line("M8 18 L22 18 L32 64 L80 64 L88 32 L26 32", 5) + circ(36, 80, 7, W) + circ(74, 80, 7, W) + `<rect x="40" y="38" width="14" height="18" rx="2" fill="${acc(k, k.c)}"/>`,
  megaphone: (k) => shape("M16 40 L44 40 L80 18 L80 82 L44 60 L16 60Z", W) + line("M30 60 L36 84", 6) + `<circle cx="88" cy="50" r="5" fill="${acc(k, k.c)}"/>`,
  shop: (k) => rect(16, 40, 68, 50, 4, W) + shape("M10 40 L20 14 L80 14 L90 40Z", acc(k, k.c)) + rect(40, 60, 20, 30, 2, S),
  handshake: (k) => line("M6 40 L26 40 L40 54 M94 40 L74 40 L50 62", 7) + shape("M30 48 L50 66 C54 70 60 66 56 60 L46 50 C52 46 60 46 66 50", acc(k, S)),
  magnet: (k) => line("M26 20 L26 54 a24 24 0 0 0 48 0 L74 20", 14) + `<rect x="18" y="14" width="16" height="12" fill="${acc(k, S)}"/><rect x="66" y="14" width="16" height="12" fill="${acc(k, S)}"/>`,
  scale: (k) => line("M50 14 L50 86 M30 86 L70 86 M16 30 L84 30", 5) + shape("M8 56 L24 30 L40 56Z", W) + shape("M60 56 L76 30 L92 56Z", W) + `<circle cx="50" cy="14" r="6" fill="${acc(k, N)}"/>`,
  zzz: (k) => txt(40, 64, "Z", 40) + txt(66, 38, "z", 28, k.a ? R : N) + txt(82, 20, "z", 18),
  fish: (k) => shape("M14 50 C30 26 62 26 76 50 C62 74 30 74 14 50Z", W) + shape("M76 50 L94 34 L94 66Z", acc(k, k.c)) + `<circle cx="32" cy="46" r="4" fill="${N}"/>`,
  bread: (k) => shape("M14 52 C10 30 30 22 50 22 C70 22 90 30 86 52 L82 86 L18 86Z", k.a ? R : GOLD) + line("M36 40 L44 32 M50 42 L58 34 M64 44 L72 36", 4),
  glass: (k) => shape("M26 12 L74 12 L66 90 L34 90Z", W) + `<path d="M30 44 L70 44 L66 88 L34 88Z" fill="${acc(k, S)}"/>`,
  medal: (k) => line("M34 8 L44 40 M66 8 L56 40", 6) + circ(50, 62, 24, GOLD) + `<circle cx="50" cy="62" r="9" fill="${acc(k, W)}"/>`,
  dice: (k) => rect(16, 16, 68, 68, 12, W) + [[34, 34], [50, 50], [66, 66]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="6" fill="${i === 1 ? acc(k, N) : N}"/>`).join(""),
  bomb: (k) => circ(44, 60, 28, N) + line("M62 38 L72 26", 6) + `<circle cx="78" cy="18" r="7" fill="${acc(k, GOLD)}"/>`,
  sprint: (k) => ICONS.runner(k) + line("M2 44 L18 44 M6 58 L22 58", 4),
  stairs: (k) => shape("M10 88 L10 70 L30 70 L30 52 L50 52 L50 34 L70 34 L70 16 L90 16 L90 88Z", S) + `<circle cx="80" cy="8" r="6" fill="${acc(k, k.c)}"/>`,
  arrowup: (k) => shape("M50 10 L84 48 L62 48 L62 90 L38 90 L38 48 L16 48Z", acc(k, k.c)),
  arrowdown: (k) => shape("M50 90 L84 52 L62 52 L62 10 L38 10 L38 52 L16 52Z", acc(k, S)),
  pen: (k) => shape("M70 10 L90 30 L38 82 L14 88 L20 64Z", W) + `<path d="M62 18 L82 38 L90 30 L70 10Z" fill="${acc(k, k.c)}"/>`,
  spread: (k) => [20, 50, 80].flatMap((x) => [20, 50, 80].map((y) => circ(x, y, 11, x === 80 && y === 80 ? acc(k, k.c) : x === 50 && y === 50 ? k.c : S))).join(""),
  mirror: (k) => `<ellipse cx="50" cy="42" rx="28" ry="34" fill="${S}" ${sk} stroke-width="3.5"/>` + line("M50 76 L50 92 M36 92 L64 92", 5) + `<circle cx="40" cy="30" r="5" fill="${acc(k, W)}"/>`,
};

export const ICON_NAMES = Object.keys(ICONS);

/** Draws an icon centred at (cx, cy) with the given size in px. */
export function icon(name: string, cx: number, cy: number, size: number, opts: { c: string; a?: boolean }) {
  const f = ICONS[name];
  if (!f) throw new Error(`unknown icon "${name}". Known: ${ICON_NAMES.join(", ")}`);
  const s = size / 100;
  return `<g transform="translate(${(cx - size / 2).toFixed(1)} ${(cy - size / 2).toFixed(1)}) scale(${s.toFixed(3)})">${f({ c: opts.c, a: !!opts.a })}</g>`;
}
