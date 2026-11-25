import wordmark from "../../brand/ympuls-wordmark-inverse.svg";

const loadImg = (src: string) => new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const lines: string[] = [];
  let line = "";
  for (const w of text.split(/\s+/)) {
    const t = line ? `${line} ${w}` : w;
    if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}

/** Renders a card as a 1080×1350 PNG in brand style. */
export async function renderCardPng(o: { kicker: string; text: string; svg?: string; source?: string }) {
  await document.fonts.ready;
  const W = 1080, H = 1350, c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#002144"; ctx.fillRect(0, 0, W, H);
  let y = 110;
  if (o.svg) {
    const size = 640, x = (W - size) / 2;
    ctx.fillStyle = "#D6DEEA"; ctx.beginPath(); ctx.roundRect(x, y, size, size, 48); ctx.fill();
    const url = URL.createObjectURL(new Blob([o.svg.replace("<svg ", '<svg width="800" height="800" ')], { type: "image/svg+xml" }));
    try { ctx.drawImage(await loadImg(url), x + 24, y + 24, size - 48, size - 48); } finally { URL.revokeObjectURL(url); }
    y += size + 90;
  } else y = 360;
  ctx.fillStyle = "#D11F3A"; ctx.beginPath(); ctx.arc(102, y - 12, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#FF6B7F"; ctx.font = "800 32px Archivo, sans-serif"; ctx.fillText(o.kicker.toUpperCase().split("").join(" "), 130, y);
  ctx.fillStyle = "#FFFFFF"; ctx.font = "900 54px Archivo, sans-serif";
  const lines = wrap(ctx, o.text.replace(/\*/g, ""), W - 180);
  const lh = 64;
  lines.slice(0, 6).forEach((l, i) => ctx.fillText(l, 90, y + 80 + i * lh));
  ctx.globalAlpha = 0.7; ctx.font = "400 30px 'Atkinson Hyperlegible', sans-serif";
  if (o.source) ctx.fillText(o.source, 90, H - 70);
  ctx.globalAlpha = 1;
  const wm = await loadImg(wordmark);
  ctx.drawImage(wm, W - 90 - 260, H - 110, 260, 260 * (125 / 659.9));
  return new Promise<Blob>((res) => c.toBlob((b) => res(b!), "image/png"));
}

/** Opens the iOS share sheet with the image, falls back to a download. */
export async function shareImage(blob: Blob, name = "ympuls.png") {
  const file = new File([blob], name, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file] }); } catch { /* user cancelled */ }
    return;
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
